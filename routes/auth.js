// import modules
const express = require("express");
const router = express.Router();
const conEnLogin = require("connect-ensure-login");
const passport = require("passport");

// index page
router.get("/", (req, res) => {
  res.redirect("/");
});

router.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate("local", (err, user, info) => {
    // server error
    if (err) {
      return next(err);
    }

    console.log(user);

    // no user found
    if (!user) {
      console.log(info);
      return res.redirect("/login?info=" + info);
    }

    // login user
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res)=>{
  req.logout();
  res.redirect("/");
})

module.exports = router;
