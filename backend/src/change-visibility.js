const mysql = require("mysql2");
const util = require("util");

async function changeVisibility(request) {
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
            `UPDATE users SET share_position=${request.body.value} WHERE username='${request.session.username}'`
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
        "value"
    ];
    return fields.every(field => params[field]);
}

module.exports = changeVisibility;