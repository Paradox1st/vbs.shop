// checks if user is mod
module.exports = function (req, res, next) {
  if (req.user) {
    if (req.user.mod) {
      return next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
};
