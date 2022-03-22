const mysql = require("mysql");
const util = require("util");
const crypto = require("crypto");
const Mailer = require("./mailer");
require("dotenv").config();

async function resetPassword(params) {
    // Schauen, ob alle Pflichtfelder ausgefüllt sind
    if (!params || !checkMandatoryFields(params)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Email lowercase machen
    params.email = params.email.toLowerCase();

    // Schauen, ob Email im gültigen Format ist
    if (!/.+@.+/.test(params.email)) return "Geben Sie eine gültige Email ein!";

    // Schauen, ob das neue Passwort sicher genug ist
    if (!securePassword(params["new-password"])) return "Das neue Passwort ist nicht sicher genug!";

    // Schauen, ob die Passwörter übereinstimmen
    if (params["new-password"] !== params["repeat-new-password"]) return "Die neuen Passwörter stimmen nicht überein!";

    // Schauen, ob die Reset Request noch nicht abgelaufen ist
    if (!(await isValidRequest(params))) return "Die Passwort Anfrage ist abgelaufen";



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
    // TODO: fix this
    try {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const result = await query(
            `SELECT COUNT(*) as count FROM users
                WHERE username='${username}'`
        );
        return result[0].count === 0;
    } catch(e) {
        console.error(e);
        return false;
    }
}

module.exports = resetPassword;