const fetch = require("cross-fetch");

async function getRandomLocation(req) {
    let result = null;
    await fetch("https://api.3geonames.org/?randomland=yes")
        .then(response => response.text())
        .then(str => result = str);

    let index = result.search("<latt>")+6;
    let lastIndex = result.search("</latt>");
    let latt = result.substring(index, lastIndex);
    index = result.search("<longt>")+7;
    lastIndex = result.search("</longt>");
    let longt = result.substring(index, lastIndex);
    index = result.search("<city>")+6;
    lastIndex = result.search("</city>");
    let city = result.substring(index, lastIndex);
    return [longt,latt,city];
}

module.exports = getRandomLocation;