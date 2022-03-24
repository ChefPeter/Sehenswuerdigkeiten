const mysql = require("mysql");
const util = require("util");

async function sendMessage(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";
    
    // recipient lowercase machen
    request.body.recipient.toLowerCase();

    // Schauen, ob die Nachricht nicht zu lang ist
    if (request.body.content.length >= 10000) return "Die Nachricht ist zu lang!";
    
    // Die Nachricht senden
    return await insertMessage(request);
}

function checkMandatoryFields(params) {
    const fields = [
        "content",
        "recipient"
    ];
    return fields.every(field => params[field]);
}

async function insertMessage(request) {
    try {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const result = await query(
            `INSERT INTO messages
            (
                sender,
                recipient,
                content,
                message_timestamp,
                is_file
            ) values
            (
                '${request.session.username}',
                '${request.body.recipient}',
                '${request.body.content}',
                NOW(),
                false
            )`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    }
}

module.exports = sendMessage;