const register = require("./register");
const login = require("./login");
const approveUser = require("./approve");
const requestReset = require("./request-reset");
const resetPassword = require("./reset");
const isAuthenticated = require("./authenticator");
const addFriend = require("./add-friend");
const rejectFriend = require("./reject-friend");
const sendMessage = require("./send-message");
const changeDescription = require("./change-description");
const changeProfilePicture = require("./change-profile-picture");
const insertReport = require("./insert-report");
const createGroup = require("./create-group");
const leaveGroup = require("./leave-group");
const addToGroup = require("./add-to-group");
const sendSights = require("./send-sights");
const  { addSight } = require("./add-sight");
const addPosition = require("./add-position");
const addRating = require("./add-rating");
const changeVisibility = require("./change-visibility");
const addRoute = require("./add-route");
const sendGroupMessage = require("./send-group-message");

const getDescription = require("./get-description");
const getFriends = require("./get-friends");
const getConversation = require("./get-conversation");
const getPendingFriends = require("./get-pending-friends");
const getProfilePicture = require("./get-profile-picture");
const getFile = require("./get-file");
const getBestRoute = require("./get-best-route");
const getUsers = require("./get-users");
const getGroups = require("./get-groups");
const getGroupConversation = require("./get-group-conversation");
const getPosition = require("./get-position");
const getRating = require("./get-rating");
const getRandomLocation = require("./get-random-location");
const getVisitedSights = require("./get-visited-sights");
const getAllPositions = require("./get-all-positions");
const getVisibility = require("./get-visibility");
const getGroupMembers = require("./get-group-members");
const getRouteNames = require("./get-route-names");
const getRoute = require("./get-route");

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const busboy = require("express-busboy");
const path = require("path");
const https = require("https");
const fs = require("fs");

const app = express();

// Middleware für den Fileupload
busboy.extend(app, {
    upload: true,
    path: path.join("./", 'uploads'),
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
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));

// Funktionen, um Antworten zu schicken
const sendResponse = (error, res) => error ? res.status(400).send(error) : res.status(200).send();
const sendGetResponse = (content, res) =>{ content !== null ? res.status(200).send(content) : res.status(400).send("Error!") };


// POST REQUESTS
app.post("/login", async(req, res) => sendResponse(await login(req), res));
app.post("/logout", (req, res) => sendResponse(req.session.destroy(), res));
app.post("/register", async(req, res) => sendResponse(await register(req.body), res));
app.post("/approve", async(req, res) => sendResponse(await approveUser(req.body), res));
app.post("/request-reset", async(req, res) => sendResponse(await requestReset(req.body), res));
app.post("/reset-password", async(req, res) => sendResponse(await resetPassword(req.body), res));
app.post("/add-friend", isAuthenticated, async(req, res) => sendResponse(await addFriend(req), res));
app.post("/reject-friend", isAuthenticated, async(req, res) => sendResponse(await rejectFriend(req), res));
app.post("/send-message", isAuthenticated, async(req, res) => sendResponse(await sendMessage(req), res));
app.post("/change-description", isAuthenticated, async(req, res) => sendResponse(await changeDescription(req), res));
app.post("/change-profile-picture", isAuthenticated, async(req, res) => sendResponse(await changeProfilePicture(req), res));
app.post("/report", isAuthenticated, async(req, res) => sendResponse(await insertReport(req), res));
app.post("/route", async(req, res) => await getBestRoute(req, res));
app.post("/create-group", isAuthenticated, async(req, res) => sendResponse(await createGroup(req), res));
app.post("/leave-group", isAuthenticated, async(req, res) => sendResponse(await leaveGroup(req), res));
app.post("/add-to-group", isAuthenticated, async(req, res) => sendResponse(await addToGroup(req), res));
app.post("/send-group-message", isAuthenticated, async(req, res) => sendResponse(await sendGroupMessage(req), res));
app.post("/sights", isAuthenticated, async(req, res) => await sendSights(req, res));
app.post("/add-sight", isAuthenticated, async(req, res) => sendResponse(await addSight(req), res));
app.post("/add-position", isAuthenticated, async(req, res) => sendResponse(await addPosition(req), res));
app.post("/add-rating", isAuthenticated, async(req, res) => sendResponse(await addRating(req), res));
app.post("/change-visibility", isAuthenticated, async(req, res) => sendResponse(await changeVisibility(req), res));
app.post("/add-route", isAuthenticated, async(req, res) => sendResponse(await addRoute(req), res));

// GET REQUESTS
app.get("/description", isAuthenticated, async(req, res) => sendGetResponse(await getDescription(req), res));
app.get("/users", isAuthenticated, async(req, res) => sendGetResponse(await getUsers(req), res));
app.get("/friends", isAuthenticated, async(req, res) => sendGetResponse(await getFriends(req.session.username), res));
app.get("/conversation", isAuthenticated, async(req, res) => sendGetResponse(await getConversation(req), res));
app.get("/logged-in", (req, res) => req.session.username ? res.status(200).send() : res.status(401).send());
app.get("/pending-friends", isAuthenticated, async (req, res) => sendGetResponse(await getPendingFriends(req), res));
app.get("/profile-picture", isAuthenticated, async (req, res) => await getProfilePicture(req, res));
app.get("/file", (req, res) => getFile(req, res));
app.get("/username", isAuthenticated, (req, res) => res.status(200).send(req.session.username));
app.get("/groups", isAuthenticated, async(req, res) => sendGetResponse(await getGroups(req), res));
app.get("/group-conversation", isAuthenticated, async(req, res) => sendGetResponse(await getGroupConversation(req), res));
app.get("/position", isAuthenticated, async(req, res) => sendGetResponse(await getPosition(req), res));
app.get("/rating", isAuthenticated, async(req, res) => sendGetResponse(await getRating(req), res));
app.get("/get-random-location", isAuthenticated, async (req, res) => sendGetResponse(await getRandomLocation(req), res));
app.get("/visited-sights", isAuthenticated, async(req, res) => sendGetResponse(await getVisitedSights(req), res));
app.get("/all-positions", isAuthenticated, async(req, res) => sendGetResponse(await getAllPositions(req), res));
app.get("/visibility", isAuthenticated, async(req, res) => sendGetResponse(await getVisibility(req), res));
app.get("/group-members", isAuthenticated, async(req, res) => sendGetResponse(await getGroupMembers(req), res));
app.get("/route-names", isAuthenticated, async(req, res) => sendGetResponse(await getRouteNames(req), res));
app.get("/route", isAuthenticated, async(req, res) => sendGetResponse(await getRoute(req), res));
//app.get("/people", isAuthenticated, async(req, res) => sendGetResponse(await getPeople(req), res));
//app.get("/logged-in", (req, res) => res.send(req.session));

app.get("/", isAuthenticated, async(req, res) => {
    res.status(200).send("Everything worked! " + req.session.username);
});

app.get("/debug", (req, res) => {
    res.sendStatus(200);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

/*
const httpsServer = https.createServer({
    key: fs.readFileSync("server.key", "utf-8"),
    cert: fs.readFileSync("server.crt", "utf-8")
}, app);

httpsServer.listen(8443);

app.listen(5000, () => console.log("Server running on http://10.10.30.18:5000"));

*/
