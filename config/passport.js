const User = require("../models/user");

const setup = function (passport) {
  // passport local authentication
  passport.use(User.createStrategy());

  // ser/deser methods
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};

// User.register(
//   {
//     username: "test",
//     f_name: "Test User",
//     talents: 9999999,
//     admin: true,
//   },
//   "test"
// );
// User.register(
//   {
//     username: "nonadmin",
//     f_name: "NoAdmin",
//   },
//   "test"
// );

module.exports = setup;
