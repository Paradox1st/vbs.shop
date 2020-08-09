// import modules
const mongoose = require("mongoose");
const Item = require("./item");

// declare schema
const CartSchema = new mongoose.Schema({
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
  cartCount: { type: Number, default: 0 },
});

CartSchema.methods.addItem = async function (addItem, opt) {
  console.log(addItem, opt);
  // look for item already in cart
  let entry = this.content.find(
    (item) => item.product.equals(addItem._id) && item.opt == opt
  );

  // if not in cart, put new entry
  if (!entry) {
    this.content.push({ product: addItem._id, count: 0, opt: opt });
    entry = this.content.find(
      (item) => item.product.equals(addItem._id) && item.opt == opt
    );
  }

  // increase count of entry
  entry.count++;

  // increase total cart count
  this.cartCount++;

  await this.save();
};

CartSchema.methods.totalPrice = async function () {
  let totalPrice = 0;

  // find all items
  await this.populate("content.product");

  this.content.forEach((item) => {
    totalPrice += item.product.price * item.count;
  });

  return totalPrice;
};

// export userschema
module.exports = mongoose.model("Cart", CartSchema);
