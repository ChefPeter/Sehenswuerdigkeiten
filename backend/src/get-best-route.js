const fetch = require("cross-fetch");

async function getBestRoute(request, res) {
    
    // Schauen, ob Pflichtfelder ausgefüllt sind
    if (!request.body.points || !request.body.vehicle) {
        res.status(400).send("Es sind nicht alle Pflichtfelder ausgefüllt!");
        return;
    }

    console.log(request.body);
    // DEBUG ONLY
    /*request.body.vehicle = "driving";
    request.body.points = [
        {geometry: [60, 30.2]},
        {geometry: [60.1, 30.3]},
        {geometry: [60.4, 30.4]},
        {geometry: [60.2, 30.5]},
        {geometry: [60, 30.6]},
    ];*/

    // Adjazenzmatrix aufbauen
    const l = request.body.points.length;
    const p = request.body.points;
    const matrix = [...Array(l)].map(e => Array(l).fill(0));
    for (let i = 0; i < l; i++) {
        for (let x = i+1; x < l; x++) {
            const distance = getDistance(p[i].geometry, p[x].geometry);
            matrix[i][x] = distance;
            matrix[x][i] = distance;
        }
    }
    res.status(200).send(tsp(matrix).map(e => p[e]));

    // Gefährlich wegen ban auf mapbox -> 
    /*for (let i = 0; i < l; i++) {
        for (let x = i+1; x < l; x++) {
            const url = `https://api.mapbox.com/directions/v5/mapbox/${request.query.vehicle}/${p[i].geometry[0]},${p[i].geometry[1]};${p[x].geometry[0]},${p[x].geometry[1]}?access_token=${process.env.MAPBOX_API_KEY}`;
            const response = await fetch(url);
            const json = await response.json();
            const distance = parseFloat(json.routes[0].distance);
            matrix[i][x] = distance;
            matrix[x][i] = distance;
        }
    }*/
    
}

function tsp(matrix) {
    let nearest = matrix[0].indexOf(Math.min(...matrix[0].slice(1))), cycle = [0, nearest, 0];
    const cost = (p1, p2) => matrix[p1][p2];
    while (cycle.length <= matrix.length){
        let overallMinCost = Infinity, pointToInsert = -1, insertionIndex = -1;
        for (let i = 0; i < matrix.length; i++) {
            if (cycle.includes(i)) continue;
            let minCost = Infinity, before = -1, after = -1;
            for (let x = 0; x < cycle.length-1; x++) {
                let currentCost = cost(cycle[x], i) + cost(i, cycle[x+1]) - cost(cycle[x], cycle[x+1]);
                if (currentCost < minCost) {
                    minCost = currentCost;
                    before = cycle[x];
                    after = cycle[x+1];
                }
            }
            let overallCurrentCost = (cost(before, i) + cost(i, after)) / (0.01 + cost(before, after));
            if (overallCurrentCost < overallMinCost) {
                overallMinCost = overallCurrentCost;
                pointToInsert = i;
                insertionIndex = cycle.indexOf(after, 1);
            }
        }
        cycle.splice(insertionIndex, 0, pointToInsert);
    }
    return cycle;
}

function rad(x) {
    return x * Math.PI / 180;
};

// Harversine distance
function getDistance(p1, p2) {
    const R = 6378137; // Radius der Erde
    const dLat = rad(p2[0] - p1[0]);
    const dLong = rad(p2[1] - p1[1]);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1[0])) * Math.cos(rad(p2[0])) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};

module.exports = getBestRoute;