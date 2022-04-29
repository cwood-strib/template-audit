const { getFiles, isTwig, ignore } = require("../utils");
const { realpath, readFile } = require('fs').promises;
const { dirname } = require("path");
const { parseStatements, makeStatement, StatementType } = require("../statement");
const { printDotVizFromRoot, addStatementsToGraph } = require("../graph");

const twigGraph = {};


function parseOptions(opts) {
    const options = {};

    const Flags = Object.freeze({
        Root: {
            long: "--root",
            short: "-r"
        },
        TwigRoot: {
            long: "--twigRoot",
            short: "-tr"
        }
    })

    for (let i = 0; i < opts.length; i++) {
        if (opts[i] === Flags.Root.short || opts[i] === Flags.Root.long) {
            if (i + 1 < opts.length) {
                options.root = opts[i+1];
            } else {
                throw new Error("Must provide a root file path");
            }
        }
        if (opts[i] === Flags.TwigRoot.short || opts[i] === Flags.TwigRoot.long) {
            if (i + 1 < opts.length) {
                options.twigRoot = opts[i+1];
            } else {
                throw new Error("Must provide a twig root path with --twigRoot");
            }
        }
    }

    if (!options.root) {
        throw new Error("Must provide a root file path with --root flag");
    }
    if (!options.twigRoot) {
        throw new Error("Must provide a twig template root path with --twigRoot flag");
    }

    return options;
}

async function graph(opts) {
    processedCount = 0;
    let options;
    try {
        options =  parseOptions(opts);
    }
    catch (e) {
        console.error(e.message)
        return;
    }

    let root = await realpath(options.root);
    let rootDir = dirname(root);

    let twigRoot = await realpath(options.twigRoot);

    return getFiles(rootDir).then(async files => {
        let paths = files.filter(file => isTwig(file) && !ignore(file));

        for (path of paths) {
            let contents = await readFile(path);
            let stmts = parseStatements(contents.toString())
                .map(makeStatement)
                .filter(stmt => !!stmt)

            processedCount++;
            await addStatementsToGraph(twigGraph, path, twigRoot, stmts);
        }

        printDotVizFromRoot(root, twigGraph);
    })
}

module.exports = {
   graph 
}