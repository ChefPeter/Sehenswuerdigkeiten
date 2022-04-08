const mysql = require("mysql");
const util = require("util");

async function addRoute(request) {

    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    console.log(request.body);

    return null;
}

function checkMandatoryFields(params) {
    const fields = [
        "route_name",
        "ids",
        "names",
        "wikidata",
        "coordinates"
    ];
    return fields.every(field => params[field]);
}

module.exports = addRoute;