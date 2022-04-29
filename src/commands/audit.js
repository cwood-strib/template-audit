const { getFiles, isTwig, ignore } = require("../utils");
const { realpath, readFile, readdir } = require('fs').promises;
const { parseStatements, makeStatement, StatementType } = require("../statement");
const { checkRepeatIncludes, addStatementsToGraph } = require("../graph");

const graph = {};

async function audit(opts) {
    let dir = opts[0];

    if (!dir) {
        console.error("Must provide the root template directory");
        return;
    }

    processedCount = 0;

    dir = await realpath(dir);

    // Main part of script
    return getFiles(dir).then(async files => {
        let paths = files.filter(file => isTwig(file) && !ignore(file));

        for (path of paths) {
            let contents = await readFile(path);
            let stmts = parseStatements(contents.toString())
                .map(makeStatement)
                .filter(stmt => !!stmt)

            processedCount++;
            await addStatementsToGraph(graph, path, dir, stmts);
        }

        // Check for repeated includes
        for (let origin of Object.keys(graph)) {
            checkRepeatIncludes(origin, graph)
        }

        console.log(`\nProcessed ${processedCount} files`);
    })
}

module.exports = {
    audit
}