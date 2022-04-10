const mysql = require("mysql2);
const util = require("util");

async function rejectFriend(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // friend lowercase machen
    request.body.friend = request.body.friend.toLowerCase();

    return await removeFriend(request);
}

function checkMandatoryFields(params) {
    const fields = [
        "friend"
    ];
    return fields.every(field => params[field]);
}

async function removeFriend(request) {
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
            `DELETE FROM friends
                WHERE
                    ( user1='${request.session.username}' AND user2='${request.body.friend}' )
                    OR
                    ( user1='${request.body.friend}' AND user2='${request.session.username}' )`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}


module.exports = rejectFriend;