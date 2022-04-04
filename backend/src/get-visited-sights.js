const mysql = require("mysql");
const util = require("util");

async function getVisitedSights(request) {
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        return Array.from(await query(
            `SELECT s.sight_id, s.sightname FROM users_sights AS us
                JOIN sights AS s ON us.sight_id = s.sight_id
                WHERE us.username = '${request.session.username}'`
        ));
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = getVisitedSights;