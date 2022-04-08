const mysql = require("mysql");
const util = require("util");
const crypto = require("crypto");
const Mailer = require("./mailer");
require("dotenv").config();

async function register(params) {
    // Schauen, ob alle Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(params)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // email und benutzername auf lowercase
    params.email = params.email.toLowerCase();
    params.username = params.username.toLowerCase();

    // Schauen, ob Email im gültigen Format ist
    if (!/.+@.+/.test(params.email)) return "Geben Sie eine gültige Email ein!";

    // Schauen, ob das Passwort sicher genug ist
    if (!securePassword(params.password)) return "Das Passwort ist nicht sicher genug!";

    // Schauen, ob die Passwörter übereinstimmen
    if (params["password"] !== params["repeat-password"]) return "Die Passwörter stimmen nicht überein!";

    // Schauen, ob Benutzername schon vergeben ist
    if (!(await checkAvailableUsername(params.username))) return "Der Benutzername ist schon vergeben!";

    // Schauen, ob Email schon vergeben ist
    if (!(await checkAvailableEmail(params.email))) return "Die Email-Adresse ist schon vergeben!";

    // Den Benutzer eintragen
    if (!(await insertUser(params))) return "Fehler mit der Datenbank!";

    return null;
}

function checkMandatoryFields(params) {
    const fields = [
        "username",
        "email",
        "password",
        "repeat-password"
    ];
    return fields.every(field => params[field]);
}

function securePassword(password) {
    return /[a-zA-Z]/g.test(password) && /\d/g.test(password) && password.length >= 8;
}

async function checkAvailableUsername(username) {
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
                WHERE username='${username}'`
        );
        return result[0].count === 0;
    } catch(e) {
        console.error(e);
        return false;
    } finally {
        conn.end();
    }
}

async function checkAvailableEmail(email) {
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
                WHERE email='${email}'`
        );
        return result[0].count === 0;
    } catch(e) {
        console.error(e);
        return false;
    } finally {
        conn.end();
    }
}

async function insertUser(params) {
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const token = crypto.randomBytes(500).toString('base64').replace(/\W/g, '');
        const salt = crypto.randomBytes(50).toString('base64').replace(/\W/g, '');
        const result = await query(
            `INSERT INTO users
            (
                username,
                email,
                password,
                salt,
                date_created,
                last_time_active,
                approved,
                approved_token
            )
            values
            (
                '${params.username}',
                '${params.email}',
                '${crypto.createHash("sha256").update(salt+params.password).digest("hex")}',
                '${salt}',
                NOW(),
                NOW(),
                false,
                '${token}'
            )`
        );
        const m = new Mailer();
        m.sendRegisterEmail(params.username, params.email, token);
        return true;
    } catch(e) {
        console.error(e);
        return false;
    } finally {
        conn.end();
    }
}

module.exports = register;