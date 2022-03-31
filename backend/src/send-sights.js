const fetch = require("cross-fetch");

async function sendSights(req, res) {
    
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(req.body)) {
        res.status(400).send("Nicht alle Pflichtfelder sind ausgefüllt!")
        return;
    }

    let points = [];
    let centerCoordinates = req.body;
    let url = getURL(parseFloat(centerCoordinates.radius)*1000, centerCoordinates.lat, centerCoordinates.lon, JSON.parse(centerCoordinates.filterAttributeLink), 500);
    if(url === "") {
        res.status(200).send("");
        return;
        //return {type: "FeatureCollection",features: [],};
    }
    //FETCHING DATA HERE
    let results = await getDataFromURL(url);
    
    results = results.filter((item, index, self) => index === self.findIndex((x) => (x.wikidata === item.wikidata)));
    
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

function checkMandatoryFields(params) {
    const fields = [
        "radius",
        "lon",
        "lat",
        "filterAttributeLink",
    ];
    return fields.every(field => params[field]);
}

async function getDataFromURL(url) {
    let result = await fetch(url);
    let answer = null;
    if (result.ok)
        answer = await result.json();
    return answer;
}

function getURL(radius, lat, lon, filterLink, limit, fame = "3") {
    const API_KEY = "5ae2e3f221c38a28845f05b690c520033dc6de71c6665213ffad8752";
    let filterAttributeLink = `kinds=${Object.keys(filterLink).filter(function(x) { return filterLink[x]; }).join(',')}`;
    if(filterAttributeLink.length>8)
        return `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&rate=${fame}&${filterAttributeLink}&format=json&limit=${limit}&apikey=${API_KEY}`
    return "";
}

module.exports = sendSights;