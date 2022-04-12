const mysql = require("mysql2");
const util = require("util");

async function getAllPositions(request) {
    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        const friends = Array.from(await query(
            `SELECT * FROM friends WHERE user1 = "${request.session.username}" OR user2 = "${request.session.username}"`
        )).map(row => row.user1 === request.session.username ? row.user2 : row.user1);

        const positions = [];
        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];
            const result = await query(
                `SELECT u.latitude AS latitude, u.longtitude AS longtitude, u.username AS username FROM users AS u
                    WHERE u.username = "${friend}" AND u.share_position = true`
            );
            if (result.length > 0) {
                positions.push(result[0]);
            }
        }
        return positions;
    } catch(e) {
        console.error(e);
        return "Fehler mit der Datenbank!";
    } finally {
        conn.end();
    }
}

module.exports = getAllPositions;