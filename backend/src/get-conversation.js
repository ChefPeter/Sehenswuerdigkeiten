const mysql = require("mysql2");
const { allowedNodeEnvironmentFlags } = require("process");
const util = require("util");

async function getConversation(request) {

    if (!request.query.friend) return null;
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const result = Array.from(await query(
            `SELECT sender, recipient, content, message_timestamp, is_file FROM messages
                WHERE 
                ( sender='${request.session.username}' AND recipient='${request.query.friend}' )
                OR
                ( sender='${request.query.friend}' AND recipient='${request.session.username}' )
                ORDER BY message_timestamp ASC
                `
        ));
        return result.filter(message => {
            if (!message.is_file) return true;
            const allowedExtensions = [
                ".apng", ".avif", ".gif", ".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp",
                ".png", ".svg", ".webp", ".bmp", ".ico", ".cur", ".tif", ".tiff",
                ".mp4", ".mov", ".webm", ".mkv", ".avi", ".wmv", ".mpeg",
                ".mp3", ".wav", ".flac", ".m4a", ".m4p"
            ];
            const extension = message.content.slice(message.content.lastIndexOf("."));
            return allowedExtensions.includes(extension)
        });
    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }
}

module.exports = getConversation;