const mysql = require("mysql2);
const util = require("util");

async function getPosition(request) {
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
            `SELECT latitude, longtitude FROM users
                WHERE username='${request.session.username}'`
        ));
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = getPosition;