
const { realpath } = require('fs').promises;
const { StatementType } = require("./statement");

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

function printDotVizFromRoot(root, graph) {
    if (!Array.isArray(graph[root])) {
        console.error(`No graph starting from ${root}`)
        return;
    }

    let queue = [...graph[root]];


    console.log(`Digraph G {`)

    // Root to immediate children
    for (let n of queue) {
        console.log(`"${root}" -> "${n}"`);
    } 

    while (queue.length) {
        let current = queue.pop();

        let nodes = graph[current];

        if (nodes) {
            for (let n of nodes ) {
                console.log(`"${current}" -> "${n}"`);
            } 
            queue = [...queue, ...nodes];
        }
    }
    console.log(`}`)
}

// This doesn't check for cycles
function checkRepeatIncludes(origin, graph) {
    let visited = new Set();
    let counter = {}; 

    let queue = [...graph[origin]];

    while (queue.length) {
        let current = queue.pop();

        if (counter[current]) {
            counter[current]++;
        }
        else {
            counter[current] = 1;
        }

        let nodes = graph[current];
        if (nodes) {
            queue = [...queue, ...nodes];
        }
    }

    let out = {};
    for (let key of Object.keys(counter)) {
        if (counter[key] > 1) {
            out[key] = counter[key];
        }
    }

    if (Object.keys(out).length > 0) {
        console.log(`From ${origin}`)
        console.log(out);
        console.log("")
    }
}

// This doesn't check for cycles
function generateSubGraphFromRoot(root, graph) {
    const newGraph = {};
    let visited = new Set();
    let counter = {}; 
    let foundRoot = false;

    let queue = [...graph[root]];

    while (queue.length) {
        let current = queue.pop();

        let nodes = graph[current];

        if (nodes) {
            queue = [...queue, ...nodes];
        }
    }

    let out = {};
    for (let key of Object.keys(counter)) {
        if (counter[key] > 1) {
            out[key] = counter[key];
        }
    }

    if (Object.keys(out).length > 0) {
        console.log(`From ${origin}`)
        console.log(out);
        console.log("")
    }
}


async function addStatementsToGraph(graph, filePath, rootDir, stmts) {
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
            // failCount++;
            // console.log(e)
        }
    }

    return graph;
}


module.exports = {
    checkRepeatIncludes,
    addStatementsToGraph,
    generateSubGraphFromRoot,
    printDotViz,
    printDotVizFromRoot
}