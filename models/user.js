// import modules
const mongoose = require("mongoose");
const passLocalMongoose = require("passport-local-mongoose");

// declare schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  f_name: String,
  talents: { type: Number, default: 0 },
  mod: { type: Boolean, default: false },
});

// plugin for passport-local-mongoose
UserSchema.plugin(passLocalMongoose);

// export userschema
module.exports = mongoose.model("User", UserSchema);
