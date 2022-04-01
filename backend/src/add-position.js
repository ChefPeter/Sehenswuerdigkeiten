const mysql = require("mysql");
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
        const result = await query(
            `UPDATE users
                SET latitude=${request.body.latitude},
                    longtitude=${request.body.longtitude}
                WHERE username='${request.session.username}'`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = addPosition;