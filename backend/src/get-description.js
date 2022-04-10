const mysql = require("mysql2);
const util = require("util");

async function getDescription(request) {

    const user = request.query.username ? request.query.username.toLowerCase() : request.session.username;
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
            `SELECT user_desc FROM users
                WHERE username='${user}'`
        );
        return result[0].user_desc || "";
    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }
}

module.exports = getDescription;