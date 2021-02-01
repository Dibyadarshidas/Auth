//jshint esversion:6
/* dot env */
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
/* Express */
const app = express();
/* EJS */
app.set('view engine', 'ejs');
/* Body Parser */
app.use(bodyParser.urlencoded(
    {
        extended: true
    }
));
app.use(express.static("public"));

/* Mongo Connect */
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

/* Schema */
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

/* Encryption */
userSchema.plugin(encrypt, { secret: process.env.key, encryptedFields: ['password']  });

const User = mongoose.model("User", userSchema);



/* ********************************************************Get Route**************************************************** */

/* Home */
app.get("/", function (req, res) {

    res.render("home");

});
/* Login */
app.get("/login", function (req, res) {

    res.render("login");

});
/* Register */
app.get("/register", function (req, res) {

    res.render("register");

});
/* submit */
app.get("/submit", function (req, res) {

    res.render("submit");

});

/* **************************************************************Post Route********************************************** */

app.post("/register", function (req, res) {

    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if (!err) {
            res.render("secrets");
        } else {
            console.log(err);
        }
    });
});

app.post("/login", function (req, res) {

    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password == password) {
                    res.render('secrets');
                } else { res.send("Incorrect Email") }
            }
        }
    });



});



app.listen(3000, function () {
    console.log("Server started on port 3000")
});
