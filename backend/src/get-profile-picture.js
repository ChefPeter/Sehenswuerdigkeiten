const mysql = require("mysql");
const path = require("path");
const util = require("util");
const fs = require("fs");

async function getProfilePicture(req, res) {
    // Get user for profile picture
    let username = req.query.friend ? req.query.friend : req.session.username;
    try {
        const conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const result = await query(
            `SELECT profile_picture AS p FROM users
                WHERE username='${username}'`
        );
        if (result.length <= 0) {
            res.status(400).send("Invalid username!");
            return;
        }

        if(result[0].p == null) {
            console.log("dwqdwq")
            res.status(400).send("No profile picture!");
            return;
        }
        const filePath = path.join(__dirname, "..", result[0].p);
        if (fs.existsSync(filePath))
            res.status(200).sendFile(filePath);
        else
            res.status(400).send("No profile picture!");
    } catch(e) {
        console.error(e);
        res.status(400).send("Fehler mit der Datenbank!");
    }
}

module.exports = getProfilePicture;