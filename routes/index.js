// import modules
const express = require("express");
const router = express.Router();
const conEnLogin = require("connect-ensure-login");
const Item = require("../models/item");

// index page
router.get("/", async (req, res) => {
  // get items
  items = await Item.find().lean();
  console.log(items);

  args = {};
  if(req.user){
    args.dispName = req.user.f_name;
  }
  args.items = items;

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

router.get('/profile', conEnLogin.ensureLoggedIn(), async (req,res)=>{
  // get user
  user = req.user;

  // fill args
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
