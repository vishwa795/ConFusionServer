var express = require('express');
var bodyParser = require("body-parser");
var Users = require("../models/users");
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup",(req,res,next)=>{
  Users.findOne({username:req.body.username})
  .then(user =>{
    if(user != null){
      var err = new Error("User "+user.username+" is already registered!");
      err.status = 403;
      next(err);
    }
    else{
      Users.create({
        username: req.body.username,
        password: req.body.password
      })
      .then(user =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json({status:"Successfully Registered!", user: user});
      }, err => next(err))
      .catch(err => next(err));
    }
  })
})

router.post("/login",(req,res,next)=>{
  if(!req.session.user){
    const authHeader = req.headers.authorization;
    if(!authHeader){
      res.setHeader("WWW-Authenticate","Basic");
      var err = new Error("You are not authenticated!");
      err.status = 401;
      next(err);
    }
    else{
      var auth = new Buffer.from(authHeader.split(" ")[1],'base64').toString().split(':');
      const username = auth[0];
      const password = auth[1];

      Users.findOne({username:username})
      .then(user =>{
        if(user == null){
          var err = new Error("User "+username+" is not registered!");
          err.status = 401;
          next(err);
        }
        else if(user.username===username && user.password !== password){
          var err = new Error(username+ " please enter the correct password");
          err.status = 401;
          next(err);
        }
        else if(user.username === username && user.password === password){
          req.session.user = "Authenticated";
          res.statusCode = 200;
          res.setHeader("Content-Type","text/plain");
          res.end("You have successfully logged in!");
        }
      })
      .catch(err => next(err))
    }
  }
  else{
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    res.end("You are already authenticted!");
    }
});

router.get("/logout",(req,res,next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie("sessionId");
    res.redirect("/");
  }
  else{
    var err = new Error("You are not logged in!");
    err.status = 401;
    next(err);
  }
})

module.exports = router;
