// import modules
const mongoose = require("mongoose");

// declare schema
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  opts: [{ type: String, required: false }],
  price: { type: Number, required: true },
  imgs: [{ type: String, required: false }],
});

// export userschema
module.exports = mongoose.model("Item", ItemSchema);
