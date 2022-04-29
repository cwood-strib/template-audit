const StatementType = Object.freeze({
    Include: "include",
    Extends: "extends"
})

function makeStatement(stmt) {
    let type = getStatementType(stmt);
    let path = parsePathFromStmt(stmt);

    if (type && path) {
        let obj = Object.create({});
        obj.type = type;
        obj.path = path;
        return obj;
    }

    return null;
}

function getStatementType(stmt) {
    if (isInclude(stmt)) {
        return StatementType.Include;
    }
    if (isExtend(stmt)) {
        return StatementType.Extends;
    }

    return null;
}


function isInclude(stmt) {
    return stmt.startsWith("{% include");
}

function isExtend(stmt) {
    return stmt.startsWith("{% extends");
}

function parsePathFromStmt(stmt) {
    let quotes = ["\"", "\'"];
    let path = "";
    let started = false;

    for (char of stmt) {
        if (quotes.includes(char)) {
            if (started === true) {
                break;
            }
            started = true;
        } else {
            if (started) {
                path += char;
            }
        }
    }

    if (started == true) {
        return normalizeTwigPath(path);
    } else {
        return null;
    }
}

function normalizeTwigPath(path) {
    path = path.replaceAll(".", "/");
    return path.endsWith("/twig") ? path.replace("/twig", ".twig") : `${path}.twig`;

}

function parseStatements(contents) {
    if (!contents) {
        return [];
    }

    let exp = new RegExp(/\{\%.+%\}/g);
    return Array.from(contents.matchAll(exp)).flatMap(match => match[0]);
}

module.exports = {
    StatementType,
    makeStatement,
    parseStatements
}