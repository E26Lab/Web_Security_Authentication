//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport')

// const mongooseEncrytion = require("mongoose-encryption")
const app = express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
port = 3000

// Configuring sessions 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));

// Initializing the passport package 
app.use(passport.initialize());
// Configuring passport to handle sessions 
app.use(passport.session());

app.listen(port, function(){
  console.log('Server up and running on port 3000')
});

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema({
  email : String, 
  password: String
});

//Implementing passport for mongoose to handle encryption/salting db 
userSchema.plugin(passportLocalMongoose);

// userSchema.plugin(mongooseEncrytion,{secret: process.env.SECRET, excludeFromEncryption:['email']});
const User = new mongoose.model("User", userSchema);

//Review what this means 
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
  res.render("home")
});
app.get("/login", function(req, res){
  res.render("login")
});
app.get("/register", function(req, res){
  res.render("register")
});

app.get('/secrets', function (req, res) {
  if (req.isAuthenticated()){
    res.render('secrets');
  } else {
    res.redirect('/login')
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.post("/register", function(req, res){
  User.register({username: req.body.username, active: false}, req.body.password, function(err, user) {
    if (err) { 
      console.log(err);
      res.redirect('/register')
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets')
        
      })
    }
      });
  });

app.post('/login', function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err){
      console.log(err);
    } else{
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets')
      });
    }
  });

});