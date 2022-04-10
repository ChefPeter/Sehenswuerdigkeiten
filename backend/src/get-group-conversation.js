const mysql = require("mysql2);
const util = require("util");

async function getGroupConversation(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!request.query.group_id) {
        return null;
    }

    // Schauen ob der Benutzer die Rechte hat die Nachrichten der Gruppe zu lesen
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
            `SELECT COUNT(*) AS c FROM users_usergroups
                WHERE username='${request.session.username}' AND group_id=${request.query.group_id}`
        );
        if (result[0].c === 0) {
            return null;
        }
        return Array.from(await query(
            `SELECT * FROM group_messages
                WHERE group_id=${request.query.group_id}`
        ));

    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }

}

module.exports = getGroupConversation;