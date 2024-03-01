// Importing environment variables
require("dotenv").config();
const config = require("./config/config");

// Imports
const express = require("express");
const session = require("express-session");
const routes = require("./routes");
const sequelize = require("./config/db");
const passport = require("./config/passport");
const cors = require("cors");

// Importing models
const Users = require("./models/user");
const Posts = require("./models/post");

// Creating the express app
const app = express();

// Middleware for enabling CORS
app.use(cors());

// Middleware for parsing the request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: config.session.secret,
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send(
      process.env.NODE_ENV === "production" ? "Something went wrong" : err.stack
    );
});

// Syncing the database and starting the server
sequelize.sync({ force: process.env.NODE_ENV !== "production" }).then(() => {
  console.log("Database & tables created!");
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
});

// Error handling
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  sequelize.close().then(() => process.exit(0));
});
