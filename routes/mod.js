// import modules
const express = require("express");
const router = express.Router();
const connLogin = require("connect-ensure-login");
const isMod = require("../middleware/ismod");

// mod index page
router.get("/", connLogin.ensureLoggedIn(), isMod, (req, res) => {
  res.render("mod/menu", { user: req.user.toJSON() });
});

// todo: orders page

// todo: users page

module.exports = router;
