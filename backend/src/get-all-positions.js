const mysql = require("mysql");
const util = require("util");

async function getAllPositions(request) {
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
            `SELECT u.latitude AS latitude, u.longtitude AS longtitude FROM users AS u
                JOIN friends AS f ON f.user1 = u.username OR f.user2 = u.username
                WHERE (f.user1 = "${request.session.username}" OR f.user2 = "${request.session.username}") AND
                    u.username != "${request.session.username}" AND
                    u.share_position = true`
        ));
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = getAllPositions;