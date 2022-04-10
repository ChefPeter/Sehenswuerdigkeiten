const mysql = require("mysql2);
const util = require("util");

async function getGroups(request) {
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
            `SELECT g.group_id, g.groupname, g.profile_picture FROM users_usergroups AS ug
                JOIN usergroups AS g ON ug.group_id = g.group_id
                WHERE ug.username = '${request.session.username}'`
        ));
    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }
}

module.exports = getGroups;