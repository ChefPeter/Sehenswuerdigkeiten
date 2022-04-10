const mysql = require("mysql2);
const util = require("util");

async function addToGroup(request) {
    
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // friend lowercase machen
    request.body.username = request.body.username.toLowerCase();

    // Add friend to group
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        // Schauen ob es den Benutzer überhaupt gibt
        let result = await query(
            `SELECT COUNT(*) AS c FROM users WHERE username = '${request.body.username}'`
        );
        if (result[0].c === 0) {
            return "Der Benutzer existiert nicht!";
        }
        // Schauen ob man die Rechte hat
        result = await query(
            `SELECT COUNT(*) AS c FROM users_usergroups
                WHERE username='${request.session.username}' AND group_id=${request.body.group_id}`
        );
        if (result[0].c === 0) {
            return "Keine Berechtigung Mitglied in diese Gruppe hinzuzufügen!";
        }

        // Schauen ob Benutzer nicht schon in der Gruppe ist
        result = await query(
            `SELECT COUNT(*) AS c FROM users_usergroups
                WHERE username='${request.body.username}' AND group_id=${request.body.group_id}`
        );
        if (result[0].c > 0) {
            return "Der Benutzer befindet sich bereits in dieser Gruppe!";
        }

        await query(
            `INSERT INTO users_usergroups
            (
                username,
                group_id
            )
            values
            (
                '${request.body.username}',
                ${request.body.group_id}
            )`
        );
        await query(
            `INSERT INTO group_messages
            (
                sender,
                group_id,
                message_timestamp,
                content,
                is_file
            )
            values
            (
                NULL,
                ${request.body.group_id},
                NOW(),
                '${request.body.username} joined the group!',
                false
            )`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }

}

function checkMandatoryFields(params) {
    const fields = [
        "group_id",
        "username"
    ];
    return fields.every(field => params[field] !== undefined);
}

module.exports = addToGroup;