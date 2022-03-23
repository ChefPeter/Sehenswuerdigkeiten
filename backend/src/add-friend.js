const mysql = require("mysql");
const util = require("util");

async function addFriend(request) {

    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // friend lowercase machen
    request.body.friend = request.body.friend.toLowerCase();

    // Funktionalität
    return await sendFriendRequest(request.session.username, request.body.friend);
}

function checkMandatoryFields(params) {
    const fields = [
        "friend",
    ];
    return fields.every(field => params[field]);
}

async function sendFriendRequest(user, friend) {
    try {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);

        // Schauen, ob der Freund überhaupt existiert
        let result = await query(
            `SELECT COUNT(*) AS count FROM users
                WHERE username='${friend}'`
        );
        if (result[0].count === 0) {
            return "Ungültiger Benutzername!";
        }
        // Falls man schon befreundet ist
        result = await query(
            `SELECT COUNT(*) AS count FROM friends
                WHERE 
                    (user1='${user}' AND user2='${friend}' AND approved=1)
                    OR
                    (user1='${friend}' AND user2='${user}' AND approved=1)`
        );
        if (result[0].count > 0) {
            return "Sie sind bereits befreundet!";
        }
        
        // Falls man schon eine Freundschaftsanfrage geschickt hat
        result = await query(
            `SELECT COUNT(*) AS count FROM friends
                WHERE user1='${user}' AND user2='${friend}' AND approved=0`
        );
        if (result[0].count > 0) {
            return "Anfrage bereits verschickt! Geben Sie ihrem Freund etwas Zeit";
        }

        // Falls der Freund schon eine Anfrage geschickt hat, dann zählt es wie eine Bestätigung
        result = await query(
            `SELECT COUNT(*) AS count FROM friends
                WHERE user1='${friend}' AND user2='${user}' AND approved=0`
        );
        if (result[0].count > 0) {
            await query(
                `UPDATE friends
                    SET approved=1
                    WHERE user1='${friend}' AND user2='${user}' AND approved=0`
            );
            return null;
        }

        // Ansonsten wird die Anfrage eingetragen
        await query(
            `INSERT INTO friends
            (
                user1,
                user2,
                approved
            )
            values
            (
                '${user}',
                '${friend}',
                0
            )`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    }
}

module.exports = addFriend;