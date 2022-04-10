const mysql = require("mysql2);
const util = require("util");
const crypto = require("crypto");
require("dotenv").config();

async function login(request) {
    
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(request.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Benutzername auf lowercase
    request.body.username = request.body.username.toLowerCase();

    // Schauen, ob die eingegebenen Daten stimmen
    const error = await checkCredentials(request.body);
    if (error) return error;

    // Falls kein Fehler aufgetreten ist, wird der Benutzer angemeldet
    request.session.username = request.body.username;
    return null;
}

function checkMandatoryFields(params) {
    const fields = [
        "username",
        "password"
    ];
    return fields.every(field => params[field]);
}

async function checkCredentials(params) {
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const salt = await query(
            `SELECT salt FROM users WHERE username='${params.username}'`
        );
        if (!salt[0].salt) return "Benutzername oder Passwort ist falsch!";
        const result = await query(
            `SELECT approved FROM users
                WHERE username='${params.username}' AND 
                    password='${crypto.createHash("sha256").update(salt[0].salt+params.password).digest("hex")}'`
        );
        if (result.length < 1) return "Benutzername oder Passwort ist falsch!";
        if (result[0].approved === 0) return "Der Benutzer wurde noch nicht bestätigt!";
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = login;