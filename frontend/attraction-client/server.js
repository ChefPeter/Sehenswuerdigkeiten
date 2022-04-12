const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = https.createServer({
    key: fs.readFileSync("react.key","utf-8"),
    cert: fs.readFileSync("react.crt","utf-8")
},app);

server.listen(8443);