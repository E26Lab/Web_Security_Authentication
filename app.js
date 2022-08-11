//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
// const mongooseEncrytion = require("mongoose-encryption")
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
port = 3000
app.listen(port, function(){
  console.log('Server up and running on port 3000')
});

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema({
  email : String, 
  password: String
});


// userSchema.plugin(mongooseEncrytion,{secret: process.env.SECRET, excludeFromEncryption:['email']});
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home")
});
app.get("/login", function(req, res){
  res.render("login")
});
app.get("/register", function(req, res){
  res.render("register")
});

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email : req.body.username,
      password : hash 
    });
  
    newUser.save(function(err){
      if (err){
        console.log(err)
      } else {
        res.render("secrets")
      }
  
    });
});

  
});
app.post('/login', function(req, res){
  const password = req.body.username;
  const username = req.body.email;
  
  User.findOne({email : username}, function(err, foundUser) {
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          // result == true
          if (result == true){
            res.render("secrets");
          }
      });{
          
        }
      }
    }
  });
  // console.log(req.body)
});