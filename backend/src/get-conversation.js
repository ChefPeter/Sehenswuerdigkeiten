const mysql = require("mysql2);
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
        return Array.from(await query(
            `SELECT sender, recipient, content, message_timestamp, is_file FROM messages
                WHERE 
                ( sender='${request.session.username}' AND recipient='${request.query.friend}' )
                OR
                ( sender='${request.query.friend}' AND recipient='${request.session.username}' )
                ORDER BY message_timestamp ASC
                `
        ));
    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }
}

module.exports = getConversation;