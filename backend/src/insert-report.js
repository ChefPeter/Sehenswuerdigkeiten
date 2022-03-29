const mysql = require("mysql");
const util = require("util");

async function insertReport(request) {
    // Schauen, ob Pflichtfelder ausgefüllt sind
    if (!request.body.content) return "Es sind nicht alle Pflichtfelder ausgefüllt!";

    // Beschwerde einreichen
    return await insertReport(request);
}

async function insertReport(request) {
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
            `INSERT INTO reports
            (
                username,
                content,
                resolved
            ) 
            values
            (
                '${request.session.username}',
                '${request.body.content}',
                false
            )`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = insertReport;