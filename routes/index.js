// import modules
const express = require("express");
const router = express.Router();
const conEnLogin = require("connect-ensure-login");
const passport = require("passport");

// index page
router.get("/", (req, res) => {
  // get user
  user = req.user
  
  // render index template
  res.render("index", user);
});

module.exports = router;
