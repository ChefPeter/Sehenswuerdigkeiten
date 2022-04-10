const fetch = require("cross-fetch");
const mysql = require("mysql2");

async function sendSights(req, res) {
    
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(req.body)) {
        res.status(400).send("Nicht alle Pflichtfelder sind ausgefüllt!")
        return;
    }
    let points = [];
    let centerCoordinates = req.body;
    let url = getURL(parseFloat(centerCoordinates.radius)*1000, centerCoordinates.lat, centerCoordinates.lon, JSON.parse(centerCoordinates.filters), 500);
    if(url === "") {
        res.status(200).send(JSON.stringify({}));
        return;
    }
    
    //FETCHING DATA HERE
    let results = await getDataFromURL(url);

    results = results.filter((item, index, self) => index === self.findIndex((x) => (x.wikidata === item.wikidata)));
    
    //insertSight(result.wikidata, result.name.replace(/"/g, '\\"').replace(/'/g, "\\'"), lat, lon);
    insertSights(results);

    for (let result of results)
    {
        const lon = result.point.lon;
        const lat = result.point.lat;
        points.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [lon, lat],
            },
            properties: {
                id: result.xid,
                name: result.name,
                wikidata: result.wikidata,
                kinds: result.kinds,
            }
        });
        
    }
    res.status(200).send(JSON.stringify(points));
    return;
}

function insertSights(data) {
    const conn = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    conn.connect((err) => {
        if (err) {
            console.log(err);
            return;
        }
        data.forEach(sight => {
            conn.query(`INSERT INTO sights (sight_id, sightname, latitude, longtitude)
                        VALUES ('${sight.wikidata}',
                         '${sight.name.replace(/"/g, '\\"').replace(/'/g, "\\'")}',
                         '${sight.point.lat}',
                         '${sight.point.lon}')`,
                         (err, _) => {});
        });
        conn.end();
    })
}

function checkMandatoryFields(params) {
    const fields = [
        "radius",
        "lon",
        "lat",
        "filters",
    ];
    return fields.every(field => {
        if (params[field]) {
            return true;
        } else {
            console.log(field);
            return false;
        }
    });
}

async function getDataFromURL(url) {
    let answer = null;
    if(url !== "")
    {
        let result = await fetch(url);
        if (result.ok)
            answer = await result.json();
    }
    return answer;
}

function getURL(radius, lat, lon, filterLink, limit, fame = "3") {
    const API_KEY = process.env.TRIPMAP_API_KEY;
    let filters = `kinds=${Object.keys(filterLink).filter(function(x) { return filterLink[x]; }).join(',')}`;
    if(filters.length>8)
        return `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&rate=${fame}&${filters}&format=json&limit=${limit}&apikey=${API_KEY}`
    return "";
}

module.exports = sendSights;