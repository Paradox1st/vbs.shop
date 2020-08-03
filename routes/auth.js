// import modules
const express = require("express");
const router = express.Router();
const conEnLogin = require("connect-ensure-login");
const passport = require("passport");

// index page
router.get("/auth", (req, res) => {
  res.redirect("/");
});

module.exports = router;
