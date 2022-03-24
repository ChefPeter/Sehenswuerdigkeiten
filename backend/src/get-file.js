const fs = require("fs");

function getFile(req, res) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(req.body)) return "Nicht alle Pflichtfelder sind ausgefüllt!";

    // Datei senden
    if (fs.existsSync(req.body.file)) {
        res.status(200).sendFile(req.body.file);
    } else {
        res.status(400).send("Datei nicht gefunden!");
    }
}

function checkMandatoryFields(params) {
    const fields = [
        "file"
    ];
    return fields.every(field => params[field]);
}

module.exports = getFile;