const mysql = require("mysql");
const util = require("util");
const crypto = require("crypto");
const Mailer = require("./mailer");
require("dotenv").config();

async function resetRequest(params) {
    // Schauen, ob alle Pflichtfelder ausgefüllt sind
    if (!params || !checkMandatoryFields(params)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Email lowercase machen
    params.email = params.email.toLowerCase();

    // Schauen, ob Email im gültigen Format ist
    if (!/.+@.+/.test(params.email)) return "Geben Sie eine gültige Email ein!";

    // Schauen, ob ein Benutzer mit diese Email existiert
    if (!(await userExists(params.email))) return "Es existiert kein Benutzer mit dieser Email!";

    // Reset Password
    if (!(await resetPassword(params.email))) return "Fehler mit der Datenbank!";

    return null;
}

function checkMandatoryFields(params) {
    const fields = [
        "email"
    ];
    return fields.every(field => params[field]);
}

async function userExists(email) {
    try {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const result = await query(
            `SELECT COUNT(*) AS count FROM users
                WHERE email='${email}'`
        );
        return result[0].count > 0;
    } catch(e) {
        console.error(e);
        return false;
    }
}

async function resetPassword(email) {
    try {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const token = crypto.randomBytes(500).toString('base64').replace(/\W/g, '');
        await query(
            `UPDATE users
                SET reset_token='${token}', reset_time=NOW()
                WHERE email='${email}'`
        );
        const result = await query(
            `SELECT username FROM users WHERE email='${email}'`
        );
        const m = new Mailer();
        m.sendRegisterEmail(result[0].username, email, token);
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}

module.exports = resetRequest;