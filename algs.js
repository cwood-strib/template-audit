
// This doesn't check for cycles
function checkRepeatIncludes(origin, graph) {
    let visited = new Set();
    let visitedM = {}; 

    let queue = [...graph[origin]];

    while (queue.length) {
        let current = queue.pop();

        if (visitedM[current]) {
            visitedM[current]++;
        }
        else {
            visitedM[current] = 1;
        }
            // console.log(`Repeat include`)
            // console.log(`Start: ${origin}`)
            // console.log(`Repeated: ${current}`)
            // console.log("");

        // visited.add(current);

        let nodes = graph[current];
        if (nodes) {
            queue = [...queue, ...nodes];
        }
    }

    let out = {};
    for (let key of Object.keys(visitedM)) {
        if (visitedM[key] > 1) {
            out[key] = visitedM[key];
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