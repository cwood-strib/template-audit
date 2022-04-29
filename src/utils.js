const { readdir } = require('fs').promises;
const { resolve } = require('path');

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

module.exports = {
    getFiles,
    isTwig,
    ignore
}