const mysql = require("mysql2");
const util = require("util");

async function addSight(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";
    // Sehenswürdigkeit in die Datenbank einfügen
    return await insertSight(request.body.sightname, request.body.latitude, request.body.longtitude);
}

function checkMandatoryFields(params) {
    const fields = [
        "sightname",
        "latitude",
        "longtitude"
    ];
    return fields.every(field => params[field]);
}

async function insertSight(sightname, latitude, longtitude) {
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const result = await query(
            `INSERT INTO sights (sightname, latitude, longtitude)
                VALUES ('${sightname}', '${latitude}', '${longtitude}')`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = { addSight, insertSight };