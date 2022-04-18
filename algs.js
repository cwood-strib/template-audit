
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

module.exports = {
    checkRepeatIncludes
}