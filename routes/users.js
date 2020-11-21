var express = require('express');
var bodyParser = require("body-parser");
var Users = require("../models/users");
var router = express.Router();
var passport = require("passport");
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup",(req,res,next)=>{
  Users.register(new Users({username:req.body.username}),req.body.password,(err,user)=>{
    if(err){
      res.statusCode = 500;
      res.setHeader("Content-Type","application/json");
      res.json({err:err});
    }
    else{
      passport.authenticate('local')(req,res, ()=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json({success:true, Status:"Registration Sucessful"});
      });
    }
  });
});

router.post("/login",passport.authenticate('local'),(req,res,next)=>{
  res.statusCode = 200;
  res.setHeader("Content-Type","application/json");
  res.json({success:true, Status:"Login Sucessful"});
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
