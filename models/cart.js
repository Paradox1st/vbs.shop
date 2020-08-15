// import modules
const mongoose = require("mongoose");

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
  let info = "";
  let infoType = "";

  // look for item already in cart
  let entry = this.content.find(
    (item) => item.product.equals(addItem._id) && item.opt == opt
  );

  // if not in cart, put new entry
  if (!entry) {
    // create new cart item entry
    this.content.push({ product: addItem._id, count: 0 });

    entry = this.content[this.content.length - 1];

    if (addItem.opts.length > 0 && addItem.opts.includes(opt)) {
      entry.opt = opt;
    } else if (opt) {
      info = "Invalid option for item";
      infoType = "error";
      return { info, infoType };
    }
  }

  // increase count of entry
  entry.count++;

  // check count
  if (entry.count > 10) {
    entry.count = 10;
    info = "Cannot have more than 10 of a single item!!";
    infoType = "error";
  } else {
    info = "Added to cart successfully";
    infoType = "success";
  }

  // increase total cart count
  this.cartCount = this.countItems();

  await this.save();
  return { info, infoType };
};

CartSchema.methods.updateItem = async function (upItem) {
  // look for the requested cart entry
  let entry = this.content.find((item) => item._id.equals(upItem._id));

  if (!entry) {
    console.error(`Error finding cart item ${upItem._id}`);
  }

  if (upItem.qty == 0) {
    this.content.splice(this.content.indexOf(entry), 1);
  } else {
    entry.count = upItem.qty;
    entry.opt = upItem.opt;
  }

  // look for target entry (could be itself or other entries in cart)
  let target = this.content.find(
    (item) =>
      item._id != entry._id &&
      item.product.equals(entry.product) &&
      item.opt == entry.opt
  );

  // combine items with same options
  if (target) {
    target.count += entry.count;
    this.content.splice(this.content.indexOf(entry), 1);
    entry = target;
  }

  // check count
  if (entry.count > 10) {
    entry.count = 10;
    info = "Cannot have more than 10 of a single item!!";
    infoType = "error";
  } else {
    info = "Cart updated successfully";
    infoType = "success";
  }

  this.cartCount = this.countItems();
  await this.save();
  return { info, infoType };
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

CartSchema.methods.countItems = function () {
  count = 0;
  this.content.forEach((item) => (count += item.count));
  return count;
};

// export userschema
module.exports = mongoose.model("Cart", CartSchema);
