const mysql = require("mysql");
const util = require("util");

async function sendGroupMessage(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Schauen, ob die Nachricht nicht zu lang ist
    if (!request.files && request.body.content.length >= 10000) return "Die Nachricht ist zu lang!";

    // Die Nachricht senden
    return await insertGroupMessage(request);
}

function checkMandatoryFields(request) {
    const fields = request.files ? 
    [
        "group_id"
    ]
    :
    [
        "content",
        "group_id"
    ];
    return fields.every(field => request.body[field]);
}

async function insertGroupMessage(request) {
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
            `INSERT INTO group_messages
            (
                sender,
                group_id,
                content,
                message_timestamp,
                is_file
            ) values
            (
                '${request.session.username}',
                '${request.body.group_id}',
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


module.exports = sendGroupMessage;