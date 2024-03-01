require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  session: {
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: process.env.SESSION_RESAVE === "true",
    saveUninitialized: process.env.SAVE_UNINITIALIZED === "true",
  },
};
