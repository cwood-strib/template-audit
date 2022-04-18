const { resolve } = require('path');
const { realpath, readFile, readdir } = require('fs').promises;
const { checkRepeatIncludes } = require("./algs");
const { StatementType, parseStatements, makeStatement } = require("./statement");

async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

function isTwig(path) {
    return path && path.endsWith(".twig");
}

// Files to ignore; right now just override templates
function ignore(file) {
    if (file.includes("override")) {
        return true;
    }

    return false;
}

// Prints a dotviz version of the graph for visualization
function printDotViz(graph) {
    console.log(`Digraph G {`)
    for (origin of Object.keys(graph)) {
        let dests = graph[origin];
        for (let dest of dests) {
            console.log(`"${origin}" -> "${dest}"`);
        }

    }
    console.log(`}`)
}

async function addStatementsToGraph(filePath, rootDir, stmts) {
    let canonical = await realpath(filePath);

    for (let stmt of stmts) {
        let includedPath = rootDir.endsWith("/") ? `${rootDir}${stmt.path}` : `${rootDir}/${stmt.path}`;
        // realpath will fail when file does not exist, which will happen currently on templates outside directory
        // where this script is pointed at
        try {
            let canonicalInclude = await realpath(includedPath);

            if (stmt.type === StatementType.Include) {
                if (graph[canonical]) {
                    graph[canonical].push(canonicalInclude)
                } else {
                    graph[canonical] = [canonicalInclude];
                }
            }
            if (stmt.type === StatementType.Extends) {
                if (graph[canonicalInclude]) {
                    graph[canonicalInclude].push(canonical)
                } else {
                    graph[canonicalInclude] = [canonical];
                }
            }

        } catch (e) {
            // there are files in more places than the theme location,
            // so this script is limited atm
            failCount++;
        }
    }
}

const graph = {};
let failCount = 0;
let processedCount = 0;

let [nodeDir, scriptPath, dir] = process.argv;

// Main part of script
getFiles(dir).then(async files => {
    let paths = files.filter(file => isTwig(file) && !ignore(file));

    for (path of paths) {
        let contents = await readFile(path);
        let stmts = parseStatements(contents.toString())
            .map(makeStatement)
            .filter(stmt => !!stmt)

        processedCount++;
        await addStatementsToGraph(path, dir, stmts);
    }

    // Check for repeated includes
    for (let origin of Object.keys(graph)) {
        checkRepeatIncludes(origin, graph)
    }
})
