const { audit } = require("./commands/audit");
const { graph } = require("./commands/graph");

let [nodeDir, scriptPath, command, ...opts] = process.argv;

const Commands = Object.freeze({
    Graph: "graph",
    Audit: "audit"
})

switch (command) {
    case Commands.Graph:
        graph(opts);
        break;
    case Commands.Audit:
        audit(opts);
        break;
    default:
        console.error("Invalid command given. Must be one of: " + Object.values(Commands).join(", ") + ".");
}