const { deserializeUser } = require("passport");
const passport = require("passport");
const LocalStratergy = require("passport-local").Strategy;
const User = require("./models/users");

exports.local = passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());