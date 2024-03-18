//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const encrypt = require('mongoose-encryption');

// Create Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse URL-encoded bodies and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json());

// Connect to MongoDB database using Mongoose
mongoose.connect('mongodb://localhost:27017/userDB');


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});




userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get('/', function(req, res){
    res.render("home");
});

app.get('/home', function(req, res){
    res.render("home");
});

app.get('/login', function(req, res){
    res.render("login");
});

app.get('/register', function(req, res){
    res.render("register");
});


app.post("/register", async function(req, res) {
    try {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save();
    res.render("secrets");

} catch (err){
    console.log(er)
}
});

app.post("/login", async function(req, res){
    try {
        const username = req.body.username;
        const password = req.body.password;

        // Find the user by email
        const foundUser = await User.findOne({ email: username });

        if (foundUser) {
            // Compare passwords
            if (foundUser.password === password) {
                res.render("secrets");
            } else {
                // Password is incorrect
                res.send("Incorrect password");
            }
        } else {
            // User not found
            res.send("User not found");
        }
    } catch (err) {
        // Error occurred during login process
        console.log("Error logging in:", err);
        res.status(500).send("Internal Server Error");
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});