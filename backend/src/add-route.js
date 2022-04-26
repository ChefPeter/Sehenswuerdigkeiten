const mysql = require("mysql2");
const util = require("util");

async function addRoute(request) {

    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    return await insertRoute(request);
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

async function insertRoute(request) {
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        // Check if route already exists
        let result = await query(
            `SELECT COUNT(*) AS c FROM routes 
                WHERE username='${request.session.username}' AND route_name='${request.body.route_name}'`
        );
        if (result[0].c > 0) return "Es existiert schon eine Route mit diesem Namen!";
        const ids = JSON.parse(request.body.ids);
        const names = JSON.parse(request.body.names);
        const wikidata = JSON.parse(request.body.wikidata);
        const coordinates = JSON.parse(request.body.coordinates);
        
        for (let i = 0; i < ids.length; i++) {
            if(ids[i].includes("randomPoint") || ids[i].includes("gps"))
                ids[i] = "r"+coordinates[i][0]+";"+coordinates[i][1];
            result = await query(
                `SELECT COUNT(*) AS c FROM points WHERE point_id='${ids[i]}'`
            );
            if (result[0].c === 0) {
                await query(
                    `INSERT INTO points 
                    (
                        point_id,
                        longtitude,
                        latitude,
                        name,
                        wikidata
                    ) values (
                        '${ids[i]}',
                        ${coordinates[i][0]},
                        ${coordinates[i][1]},
                        '${names[i].replace(/["'`]/g , " ")}',
                        '${wikidata[i]}'
                    )`
                );
            }
            await query(
                `INSERT INTO routes (
                    username,
                    route_name,
                    point_id
                ) values (
                    '${request.session.username}',
                    '${request.body.route_name}',
                    '${ids[i]}'
                )`
            );
        }

        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = addRoute;