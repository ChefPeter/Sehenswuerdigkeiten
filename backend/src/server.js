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

function sendResponse(error, res) {
    if (error) {
        res.status(400).send(error);
    } else {
        res.status(200).send();
    }
}

app.post("/login", async(req, res) => {
    const error = await login(req);
    sendResponse(error, res);
});

app.post("/register", async(req, res) => {
    const error = await register(req.body);
    sendResponse(error, res);
});

app.post("/approve", async(req, res) => {
    const error = await approveUser(req.body);
    sendResponse(error, res);
});

app.post("/request-reset", async(req, res) => {
    const error = await requestReset(req.body);
    sendResponse(error, res);
});

app.post("/reset-password", async(req, res) => {
    const error = await resetPassword(req.body);
    sendResponse(error, res);
});

app.get("/", isAuthenticated, async(req, res) => {
    res.status(200).send("Everything worked! " + req.session.username);
});

app.get("/debug", (req, res) => {
    res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));