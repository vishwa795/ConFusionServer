const { deserializeUser } = require("passport");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtStratergy = require("passport-jwt").Strategy;
const ExtractJwt  = require("passport-jwt").ExtractJwt;
const config = require("./config");
const LocalStratergy = require("passport-local").Strategy;
const User = require("./models/users");

exports.local = passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user)=> jwt.sign(user,config.secretKey,{expiresIn: 3600});

var opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new jwtStratergy(opts,(jwt_payload,done) =>{
    console.log(jwt_payload);
    User.findOne({_id:jwt_payload._id},(err,res)=>{
        if(err){
            done(err,false);
        }
        else if(res){
            done(null,res);
        }
        else{
            done(null,false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt',{session:false});
exports.verifyAdmin = (req,res,next) =>{
    if(req.user.admin){
        next();
    }
    else{
        var err = new Error("You are not authenticated");
        err.status = 403;
        next(err);
    }
}