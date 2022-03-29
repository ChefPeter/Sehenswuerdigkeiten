const mysql = require("mysql");
const util = require("util");
require("dotenv").config();

async function approveUser(params) {
    // Schauen, ob alle Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(params)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Email lowercase machen
    params.email = params.email.toLowerCase();

    // Schauen, ob mit der Token stimmt
    if (!(await checkToken(params))) return "Es ist ein Fehler aufgetreten!";

    // Den Benutzer aktivieren
    return await activateUser(params);
}

function checkMandatoryFields(params) {
    const fields = [
        "email",
        "approved-token"
    ];
    return fields.every(field => params[field]);
}

async function checkToken(params) {
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
            `SELECT COUNT(*) AS count FROM users
                WHERE approved=0 AND email='${params.email}' AND approved_token='${params["approved-token"]}'`
        );
        return result[0].count > 0;
    } catch(e) {
        console.error(e);
        return false;
    } finally {
        conn.end();
    }
}

async function activateUser(params) {
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
                SET approved = true, approved_token=NULL
                WHERE approved=0 AND email='${params.email}' AND approved_token='${params["approved-token"]}'`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = approveUser;