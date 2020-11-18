var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var session = require("express-session");
var FileStore = require("session-file-store")(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leaderRouter");
var Dishes = require("./models/dishes");
const { Buffer } = require('buffer');

var app = express();

const url="mongodb://localhost:27017/ConFusion";

const connect = mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});

connect.then(db=>{
  console.log("Connected Successfully to MongoDB!");
}, err=> console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name:"sessionId",
  secret:"12345-67890-09876-54321",
  saveUninitialized:false,
  resave:false,
  store: new FileStore()
}));

app.use((req,res,next)=>{
  console.log(req.headers);
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

      if(username === "admin" && password === "password"){
        req.session.user = "admin";
        next();
      }
      else{
        res.setHeader("WWW-Authenticate","Basic");
        var err = new Error("You are not Authenticated!");
        err.status = 401;
        next(err);
      }
    }
  }
  else{
    if(req.signedCookies.user === "admin"){
      next();
    }
    else{
      var err = new Error("You are not Authenticated!");
      err.status = 401;
      next(err);
    }
  }
})
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/dishes",dishRouter);
app.use("/promotions",promoRouter);
app.use("/leaders",leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
