// import modules
const express = require("express");
const router = express.Router();
const connLogin = require("connect-ensure-login");
const isMod = require("../middleware/ismod");

// index page
router.get("/", connLogin.ensureLoggedIn(), isMod, (req, res) => {
  res.send("You are a mod");
});

module.exports = router;
