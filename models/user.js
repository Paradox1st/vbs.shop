const mongoose = require("mongoose");
const passLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({});

// plugin for passport-local-mongoose
UserSchema.plugin(passLocalMongoose);

// export userschema
module.exports = mongoose.model("User", UserSchema);
