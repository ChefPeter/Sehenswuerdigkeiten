const fetch = require("cross-fetch");

async function getBestRoute(request, res) {

    // Schauen, ob Pflichtfelder ausgefüllt sind
    if (!request.body.points || !request.body.vehicle) {
        res.status(400).send("Es sind nicht alle Pflichtfelder ausgefüllt!");
        return;
    }

    //console.log(request.body);
    // DEBUG ONLY
    //request.body.vehicle = "driving";
    //let data = {body: {poins: {geometry: {coordinate: [[11.636887, 46.712631], [11.659419, 46.71291], [11.657669, 46.715897], [11.655903, 46.714851]]}}};
    /*request.body.points = [
        {geometry: [60, 30.2]},
        {geometry: [60.1, 30.3]},
        {geometry: [60.4, 30.4]},
        {geometry: [60.2, 30.5]},
        {geometry: [60, 30.6]},
    ];*/

/*[
    {
        geometry: {
            coordinates: [11.636887, 46.712631]
        }
    },
    {
        geometry: {
            coordinates: [11.659419, 46.71291]
        }
    },
    {
        geometry: {
            coordinates: [11.657669, 46.715897]
        }
    },
    {
        geometry: {
            coordinates: [11.655903, 46.714851]
        }
    }
]*/
    console.log("ROUTE");
    // Adjazenzmatrix aufbauen
    const p = JSON.parse(request.body.points);
    const l = p.length;
    let route = {
        "coords": [],
        "distance": 0,
        "duration": 0,
    };
   
    const matrix = [...Array(l)].map(e => Array(l).fill(0));
    for (let i = 0; i < l; i++) {
        for (let x = i+1; x < l; x++) {
            const distance = getDistance(p[i].geometry.coordinates, p[x].geometry.coordinates);
            matrix[i][x] = distance;
            matrix[x][i] = distance;
        }
    }
    let coords=null;
    try{
        coords = tsp(matrix).map(e => p[e].geometry.coordinates);
    }catch(e){return null;}

    if(request.body.returnToStart == "false")
        coords.pop(); //last element is starting point

    let sortedIDs = [];
    let sortedCoords = coords;
    if(request.body.returnToStart != "false")
        sortedCoords.pop(); //last element is starting point
    for(let i = 0; i<l; i++){
        for(let x = 0; x<l; x++){
            if(coords[i][0] === p[x].geometry.coordinates[0] && coords[i][1] === p[x].geometry.coordinates[1]){
                sortedIDs.push({id: p[x].properties.id, name: p[x].properties.name});
            }
        }
    }
    if(request.body.returnToStart != "false"){
        sortedIDs.push(sortedIDs[0]);
        coords.push(coords[0]);
    }
    let weather = await getDataFromURL(getWeatherURL(p[0].geometry.coordinates[1], p[0].geometry.coordinates[0]));
    //zwischen lat lon , zwischen zwei ; 25
    for(let count = 0; count < coords.length; count += 25)
    {
        try {
            let rout = await getDataFromURL(getRouteURL(request.body.vehicle, coords.slice(count, count + 25).join(";"), "en"));
            route.coords = route.coords.concat(rout.routes[0].geometry.coordinates);
            route.duration += rout.routes[0].duration;
            route.distance += rout.routes[0].distance;
        } catch (e) {
            //return an error...
            res.status(201).send(JSON.stringify({route: route, sortedIDs: sortedIDs, sortedCoords: sortedCoords, weather: weather}));
            console.log("error at route");
            return;
        }
    }
    
    res.status(200).send(JSON.stringify({route: route, sortedIDs: sortedIDs, sortedCoords: sortedCoords, weather: weather}));

    /*for(let count = 1; count < coords.length; count++)
    {
      let rout = await getDataFromURL(getRouteURL(request.body.vehicle, `${coords[count - 1].join(",")};${coords[count].join(",")}`, "en"));
      route.coords = route.coords.concat(rout.routes[0].geometry.coordinates);
      route.duration += rout.routes[0].duration;
      route.distance += rout.routes[0].distance;
    }*
    
    //res.status(200).send(tsp(matrix).map(e => p[e]));

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

//function convexHull(points, matrix) {
//};


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

function getRouteURL(type, coords, language)
{
    const API_KEY=process.env.MAP_BOX_API_KEY;
    return `https://api.mapbox.com/directions/v5/mapbox/${type}/${(new URLSearchParams(coords).toString()).slice(0,-1)}?alternatives=false&overview=full&geometries=geojson&language=${language}&steps=true&access_token=${API_KEY}`;
}

function getWeatherURL(lat, lon)
{
    const API_KEY=process.env.OPENWEATHER_API_KEY;
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
}

async function getDataFromURL(url)
{
    let result = await fetch(url);
    let answer = null;
    if(result.ok)
        answer = await result.json();
      
    return answer;
}

module.exports = getBestRoute;