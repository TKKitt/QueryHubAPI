require("dotenv").config();
const express = require("express");
const db = require("./queries");
const passport = require("./config/passport");
const ensureAuthenticated = require("./config/ensureAuthenticated");
const bcrypt = require("bcryptjs");
const { User } = require("./models/user");

const router = express.Router();

// Home Route
router.get("/", (req, res) => {
  res.json({
    info: "Node.JS, Express, and PostgreSQL API for Query Hub.",
  });
});

// User routes
router.get("/users", async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
});

router.get("/users/:id", async (req, res) => {
  const user = await db.getUserById(req.params.id);
  res.json(user);
});

router.post("/users", async (req, res) => {
  const user = await db.createUser(req.body);
  res.json(user);
});

router.put("/users/:id", async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  res.json(user);
});

router.delete("/users/:id", async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  res.json(user);
});

// Post routes
router.get("/posts", async (req, res) => {
  const posts = await db.getAllPosts();
  res.json(posts);
});

router.get("/posts/:id", async (req, res) => {
  const post = await db.getPostById(req.params.id);
  res.json(post);
});

router.post("/posts", async (req, res) => {
  const post = await db.createPost(req.body);
  res.json(post);
});

router.put("/posts/:id", async (req, res) => {
  const post = await db.updatePost(req.params.id, req.body);
  res.json(post);
});

router.delete("/posts/:id", async (req, res) => {
  const post = await db.deletePost(req.params.id);
  res.json(post);
});

// Google Strategy Authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

// Local Strategy Authentication
router.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.post("/auth/register", async (req, res) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();

    res.send("User registered");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Testing a protected route
router.get("/protected-route", ensureAuthenticated, function (req, res) {
  res.json(req.user);
});

module.exports = router;
