const mysql = require("mysql2");
const util = require("util");

async function changeDescription(request) {

    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Beschreibung eintragen
    return insertDescription(request);
}

function checkMandatoryFields(params) {
    const fields = [
        "description"
    ];
    return fields.every(field => params[field] !== undefined);
}

async function insertDescription(request) {
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
            `UPDATE users
                SET user_desc='${request.body.description}'
                WHERE username='${request.session.username}'`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = changeDescription;