const mysql = require("mysql");
const util = require("util");

async function getGroupMembers(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!request.query.group_id) return null;

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
            `SELECT COUNT(*) AS c FROM users_usergroups
                WHERE username='${request.session.username}' AND group_id=${request.query.group_id}`
        );
        if (result[0].c === 0) return null;
        return Array.from(await query(
            `SELECT u.username AS username, u.user_desc AS description FROM users_usergroups AS ug
                JOIN users AS u ON ug.username = u.username
                WHERE ug.group_id=${request.query.group_id}`
        ));

        
    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }
}

module.exports = getGroupMembers;