const mysql = require("mysql");
const util = require("util");

async function getRoute(request) {

    // Schauen ob Pflichtfleder ausgefüllt sind
    if (!request.query.route_name) return null;

    let conn;
    try {
        conn = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
        const query = util.promisify(conn.query).bind(conn);
        return Array.from(await query(
            `SELECT p.point_id, p.latitude, p.longtitude, p.name, p.wikidata FROM routes AS r
                JOIN points AS p ON r.point_id = p.point_id
                WHERE r.username='${request.session.username}' AND route_name='${request.query.route_name}'`
        ));
    } catch(e) {
        console.error(e);
        return null;
    } finally {
        conn.end();
    }
}

module.exports = getRoute;