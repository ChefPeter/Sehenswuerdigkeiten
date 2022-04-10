const mysql = require("mysql2);
const util = require("util");

async function getFriends(user) {
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
            `SELECT user1 FROM friends
                WHERE user2='${user}' AND approved=1`
            ))
            .map(e => e.user1)
        .concat(Array.from(await query(
            `SELECT user2 FROM friends
                WHERE user1='${user}' AND approved=1`
            ))
            .map(e => e.user2)
        );
    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }
}

module.exports = getFriends;