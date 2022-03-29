const fs = require("fs");
const path = require("path");

function getFile(req, res) {
    // Schauen ob Pflichtfelder ausgefüllt sind
    if (!checkMandatoryFields(req.query)) {
        res.status(400).send("Nicht alle Pflichtfelder sind ausgefüllt!");
        return;
    }
    // Datei senden
    
    if (fs.existsSync(path.join(__dirname, "..", req.query.file))) {
        res.status(200).sendFile(path.join(__dirname, "..", req.query.file));
        return
    } else {
        res.status(400).send("Datei nicht gefunden!");
        return
    }
}

function checkMandatoryFields(params) {
    const fields = [
        "file"
    ];
    return fields.every(field => params[field]);
}

module.exports = getFile;