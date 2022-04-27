const mysql = require("mysql2");
const util = require("util");

async function deleteRoute(request) {

    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    return await removeRoute(request);
}

function checkMandatoryFields(params) {
    const fields = [
        "route_name",
    ];
    return fields.every(field => params[field]);
}

async function removeRoute(request) {
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        
        await query (`DELETE FROM routes WHERE route_name = '${request.body.route_name}' AND username = '${request.session.username}'`);
        
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = deleteRoute;