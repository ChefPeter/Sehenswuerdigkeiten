const mysql = require("mysql2);
const util = require("util");

async function addPosition(request) {

    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    return await insertPosition(request);
}

function checkMandatoryFields(params) {
    const fields = [
        "latitude",
        "longtitude"
    ];
    return fields.every(field => params[field]);
}

async function insertPosition(request) {
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
            `UPDATE users
                SET latitude=${request.body.latitude},
                    longtitude=${request.body.longtitude}
                WHERE username='${request.session.username}'`
        );
        const result = await query(
            `SELECT sight_id FROM sights 
            WHERE abs(latitude-${request.body.latitude}) < 0.001 AND abs(longtitude-${request.body.longtitude}) < 0.001`
        );
        for (let i = 0; i < result.length; i++) {
            await query(`INSERT INTO users_sights (username, sight_id) values ('${request.session.username}', '${result[i].sight_id}')`);
        }
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = addPosition;