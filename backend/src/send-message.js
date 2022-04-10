const mysql = require("mysql2");
const util = require("util");

async function sendMessage(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request)) return "Nicht alle Pflichtfelder sind ausgefüllt!";
    
    // recipient lowercase machen
    request.body.recipient.toLowerCase();

    // Schauen, ob die Nachricht nicht zu lang ist
    if (!request.files && request.body.content.length >= 10000) return "Die Nachricht ist zu lang!";
    
    // Die Nachricht senden
    return await insertMessage(request);
}

function checkMandatoryFields(request) {
    const fields =  request.files ? 
    [
        "recipient"
    ]
    :
    [
        "content",
        "recipient"
    ];
    return fields.every(field => request.body[field]);
}

async function insertMessage(request) {
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
                '${request.files.file ? request.files.file.file.replace(/\\/g, "\\\\") : request.body.content}',
                NOW(),
                ${request.files.file ? 'true' : 'false'}
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

module.exports = sendMessage;