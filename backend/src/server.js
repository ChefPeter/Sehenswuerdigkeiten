const register = require("./register");
const login = require("./login");
const approveUser = require("./approve");
const requestReset = require("./request-reset");
const resetPassword = require("./reset");
const isAuthenticated = require("./authenticator");

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const busboy = require("express-busboy");
const path = require("path");

const app = express();

// Middleware für den Fileupload
busboy.extend(app, {
    upload: true,
    path: path.join(__dirname, 'uploads'),
    allowedPath: /./,
});

// Middleware, für Login
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

// Middleware, um Request zu bearbeiten
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Middleware für cors bei requests
app.use(cors());

/*function sendResponse(error, res) {
    if (error) {
        res.status(400).send(error);
    } else {
        res.status(200).send();
    }
}*/
// Funktion, um Antworten zu schicken
const sendResponse = (error, res) => error ? res.status(400).send(error) : res.status(200).send();

app.post("/login", async(req, res) => sendResponse(await login(req), res));
app.post("/register", async(req, res) => sendResponse(await register(req.body), res));
app.post("/approve", async(req, res) => sendResponse(await approveUser(req.body), res));
app.post("/request-reset", async(req, res) => sendResponse(await requestReset(req.body), res));
app.post("/reset-password", async(req, res) => sendResponse(await resetPassword(req.body), res));


app.get("/", isAuthenticated, async(req, res) => {
    res.status(200).send("Everything worked! " + req.session.username);
});

app.get("/debug", (req, res) => {
    res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));