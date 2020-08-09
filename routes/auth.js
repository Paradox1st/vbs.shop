// import modules
const express = require("express");
const router = express.Router();
const passport = require("passport");

// index page
router.get("/", (req, res) => {
  res.redirect("/");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // server error
    if (err) {
      return next(err);
    }

    // no user found
    if (!user) {
      return res.redirect("/login?info=" + info.message);
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

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
