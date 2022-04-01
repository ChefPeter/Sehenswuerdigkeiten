const mysql = require("mysql");
const util = require("util");

async function getRating(request) {
    // Schauen, ob Pflichtfelder ausgefüllt sind
    if (!request.query.sight_id) return null;

    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        let result = await query(
            `SELECT AVG(rating) AS avg FROM ratings WHERE sight_id='${request.query.sight_id}'`
        );
        return result[0].avg;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = getRating;