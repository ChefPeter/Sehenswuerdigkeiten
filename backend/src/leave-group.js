const mysql = require("mysql");
const util = require("util");

async function leaveGroup(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";
    
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        await query(
            `DELETE FROM users_usergroups
                WHERE username='${request.session.username}' AND group_id=${request.body.group_id}`
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
        "group_id"
    ];
    return fields.every(field => params[field] !== undefined);
}


module.exports = leaveGroup;