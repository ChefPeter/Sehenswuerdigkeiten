const mysql = require("mysql");
const util = require("util");

async function changeProfilePicture(request) {
    // Schauen, ob Pflichtfelder ausgefüllt sind
    if (!request.files["profile-picture"]) return "Kein Bild hochgeladen!";

    // Schauen, ob hochgeladene Datei wirklich ein Bild ist
    if (!isPicture(request.files["profile-picture"])) return "Die hochgeladene Datei ist kein Bild!";

    // Bild in die Datenbank eintragen
    return await insertPicture(request.session.username, request.files["profile-picture"]);
}

function isPicture(file) {
    return ["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype);
}

async function insertPicture(username, file) {
    try {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const result = await query(
            `UPDATE users
                SET profile_picture='${file.file}'
                WHERE username='${username}'`
        );
        return null;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    }
}

module.exports = changeProfilePicture;