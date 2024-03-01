require("dotenv").config();

const { findOrCreateGoogleUser } = require("../models/user");
const { User } = require("../models/user");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      findOrCreateGoogleUser(profile)
        .then(([user, created]) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

passport.use(
  new LocalStrategy(function (email, password, done) {
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Invalid email" });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        });
      })
      .catch((err) => done(err));
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.dataValues.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

module.exports = passport;
