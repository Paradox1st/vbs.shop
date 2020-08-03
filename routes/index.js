// import modules
const express = require("express");
const router = express.Router();
const conEnLogin = require("connect-ensure-login");
const passport = require("passport");

// index page
router.get("/", (req, res) => {
  // get user
  user = req.user;
  args = {};
  if(user){
    args.dispName = user.f_name;
  }

  // render index template
  res.render("index", args);
});

// login page
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res)=>{
  res.redirect("/auth/logout");
});

router.get('/profile', conEnLogin.ensureLoggedIn(), (req,res)=>{
  // get user
  user = req.user;
  args = {};
  if(user){
    args.username = user.username;
    args.f_name = user.f_name;
    args.talents = user.talents;
    args.mod = user.mod;
  }

  res.render("profile", args);
})

module.exports = router;
