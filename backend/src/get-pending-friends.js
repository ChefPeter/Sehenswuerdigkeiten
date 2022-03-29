const mysql = require("mysql");
const util = require("util");

async function getPendingFriends(request) {
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
            `SELECT user1 FROM friends
                WHERE user2='${request.session.username}' AND approved=0`
        );
        return Array.from(result).map(e => e.user1);
    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }
}

module.exports = getPendingFriends;