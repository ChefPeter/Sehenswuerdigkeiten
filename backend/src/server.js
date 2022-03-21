const reqister = require("./register");

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

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


app.get("/login", (req, res) => {

});

app.post("/register", async(req, res) => {
    const error = await register(req.body);
    if (error) {
        res.status(400).send(error);
    } else {
        res.status(200).send();
    }
});



app.listen(3000, () => console.log("Server running on http://localhost:3000"));