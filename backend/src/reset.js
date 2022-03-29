const mysql = require("mysql");
const util = require("util");
const crypto = require("crypto");
require("dotenv").config();

async function resetPassword(params) {
    // Schauen, ob alle Pflichtfelder ausgefüllt sind
    if (!params || !checkMandatoryFields(params)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Email lowercase machen
    params.email = params.email.toLowerCase();

    // Schauen, ob Email im gültigen Format ist
    if (!/.+@.+/.test(params.email)) return "Fehler mit der Anfrage!";

    // Schauen, ob das neue Passwort sicher genug ist
    if (!securePassword(params["new-password"])) return "Das neue Passwort ist nicht sicher genug!";

    // Schauen, ob die Passwörter übereinstimmen
    if (params["new-password"] !== params["repeat-new-password"]) return "Die neuen Passwörter stimmen nicht überein!";

    // Schauen, ob die Reset Request noch nicht abgelaufen ist
    if (!(await isValidRequest(params))) return "Fehler mit der Anfrage!";

    // Das Passwort ändern/zurücksetzen
    return await changePassword(params);
}

function checkMandatoryFields(params) {
    const fields = [
        "email",
        "reset-token",
        "new-password",
        "repeat-new-password"
    ];
    return fields.every(field => params[field]);
}

function securePassword(password) {
    return /[a-zA-Z]/g.test(password) && /\d/g.test(password) && password.length >= 8;
}

async function isValidRequest(params) {
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
            `SELECT COUNT(*) as count FROM users
                WHERE
                    email='${params.email}' AND
                    approved=1 AND
                    reset_token='${params["reset-token"]}' AND
                    reset_time > NOW() - INTERVAL 10 MINUTE`
        );
        return result[0].count > 0;
    } catch(e) {
        console.error(e);
        return false;
    } finally {
        conn.end();
    }
}

async function changePassword(params) {
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
            `UPDATE users SET
                password='${crypto.createHash("sha256").update(params["new-password"]).digest("hex")}',
                reset_token=NULL,
                reset_time=NULL
                WHERE email='${params.email}'`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = resetPassword;