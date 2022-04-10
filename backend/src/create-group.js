const mysql = require("mysql2);
const util = require("util");

async function createGroup(request) {

    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Die Gruppe erstellen
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
            `SELECT MAX(group_id) AS c FROM usergroups`
        );
        const groupId = result[0].c + 1;
        await query(
            `INSERT INTO usergroups
            (
                group_id,
                groupname
            )
            values
            (
                ${groupId},
                '${request.body.groupname}'
            )`
        );
        
        await query(
            `INSERT INTO users_usergroups
            (
                username,
                group_id
            )
            values
            (
                '${request.session.username}',
                ${groupId}
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
        "groupname"
    ];
    return fields.every(field => params[field] !== undefined);
}

module.exports = createGroup;