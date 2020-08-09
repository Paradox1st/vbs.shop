// import modules
const mongoose = require("mongoose");
const monPaginate = require("mongoose-paginate");

// declare schema
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  opts: [{ type: String, required: false }],
  price: { type: Number, required: true },
  imgs: [{ type: String, required: false }],
});

ItemSchema.plugin(monPaginate);

// export userschema
module.exports = mongoose.model("Item", ItemSchema);
