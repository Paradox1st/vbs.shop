// import modules
const mongoose = require("mongoose");

// declare schema
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      count: { type: Number, required: true },
      opt: String,
    },
  ],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// export userschema
module.exports = mongoose.model("Order", OrderSchema);
