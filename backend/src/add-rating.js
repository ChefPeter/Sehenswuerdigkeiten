const mysql = require("mysql2);
const util = require("util");

async function addRating(request) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";
    
    // Rating eintragen
    return await insertRating(request);
}

function checkMandatoryFields(params) {
    const fields = [
        "sight_id",
        "rating"
    ];
    return fields.every(field => params[field]);
}

async function insertRating(request) {
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        // Schauen ob man die Sehenswürdigkeit schon besucht hat
        let result = await query(
            `SELECT COUNT(*) AS c FROM users_sights
                WHERE username='${request.session.username}' AND sight_id='${request.body.sight_id}'`
        );
        if (result[0].c === 0) return "Sie können keine Sehenswürdigkeit bewerten, die Sie noch nicht besucht haben!";

        // Schauen ob Sehenswürdigkeit schon bewertet worden ist
        result = await query(
            `SELECT COUNT(*) AS c FROM ratings
                WHERE username='${request.session.username}' AND sight_id='${request.body.sight_id}'`
        );
        if (result[0].c > 0) return "Sie haben diese Sehenswürdigkeit schon bewertet!";

        // Rating eintragen
        await query(
            `INSERT INTO ratings
            (
                username,
                sight_id,
                rating
            )
            values
            (
                '${request.session.username}',
                '${request.body.sight_id}',
                ${request.body.rating}
            )`
        )

        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = addRating;