// import modules
const express = require("express");
const router = express.Router();
const connLogin = require("connect-ensure-login");
const Item = require("../models/item");
const Cart = require("../models/cart");

// index page
router.get("/", async (req, res) => {
  // load user
  let user = req.user;

  if (user) {
    // get user cart
    let cart = await Cart.findOne({ user: user._id }).exec();
    if (!cart) {
      cart = new Cart({
        user: user._id,
      });
      await cart.save();
      console.log(`Saved cart: ${cart}`);
    }

    user.cart = cart.toJSON();
    user.items_in_cart = cart.totalCount();
    user = user.toJSON();
  }
  // spotlight items (most expensive 3)
  let spotlight = await Item.find().sort({ price: "asc" }).limit(3).lean();

  // get items
  let items = await Item.find().lean();

  // build args
  let args = {
    spotlight: spotlight,
    items: items,
    user: user,
  };

  // render index template
  res.render("index", args);
});

// login page
router.get("/login", (req, res) => {
  res.render("user/login");
});

router.get("/profile", connLogin.ensureLoggedIn(), async (req, res) => {
  // get user
  let user = req.user.toJSON();

  res.render("user/profile", { user: user });
  // res.redirect("back");   // use this for cart items
});

module.exports = router;
