const register = require("./register");
const login = require("./login");
const approveUser = require("./approve");
const requestReset = require("./request-reset");
const resetPassword = require("./reset");
const isAuthenticated = require("./authenticator");
const addFriend = require("./add-friend");
const sendMessage = require("./send-message");
const changeDescription = require("./change-description");

const getDescription = require("./get-description");
const getFriends = require("./get-friends");

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

// Funktionen, um Antworten zu schicken
const sendResponse = (error, res) => error ? res.status(400).send(error) : res.status(200).send();
const sendGetResponse = (content, res) => content !== null ? res.status(200).send(content) : res.status(400).send("Error!");


// POST REQUESTS
app.post("/login", async(req, res) => sendResponse(await login(req), res));
app.post("/logout", (req, res) => sendResponse(req.session.destroy(), res));
app.post("/register", async(req, res) => sendResponse(await register(req.body), res));
app.post("/approve", async(req, res) => sendResponse(await approveUser(req.body), res));
app.post("/request-reset", async(req, res) => sendResponse(await requestReset(req.body), res));
app.post("/reset-password", async(req, res) => sendResponse(await resetPassword(req.body), res));
app.post("/add-friend", isAuthenticated, async(req, res) => sendResponse(await addFriend(req), res));
app.post("/sendMessage", isAuthenticated, async(req, res) => sendResponse(await sendMessage(req), res));
app.post("/change-description", isAuthenticated, async(req, res) => sendResponse(await changeDescription(req), res));

// GET REQUESTS
app.get("/description", isAuthenticated, async(req, res) => sendGetResponse(await getDescription(req.session.username), res));
app.get("/friends", isAuthenticated, async(req, res) => sendGetResponse(await getFriends(req.session.username), res));

app.get("/", isAuthenticated, async(req, res) => {
    res.status(200).send("Everything worked! " + req.session.username);
});

app.get("/debug", (req, res) => {
    res.sendStatus(200);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));