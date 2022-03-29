const mysql = require("mysql");
const util = require("util");

async function getUsers(request) {
    try {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        return Array.from(await query(
            `SELECT username FROM users`
        ));
    } catch(e) {
        console.error(e);
        return null;
    }
}

module.exports = getUsers;