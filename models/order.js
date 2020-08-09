// import modules
const mongoose = require("mongoose");

// declare schema
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      count: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
});

// export userschema
module.exports = mongoose.model("Cart", OrderSchema);
