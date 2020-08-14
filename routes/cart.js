// import modules
const express = require("express");
const router = express.Router();
const connLogin = require("connect-ensure-login");
const Item = require("../models/item");
const Cart = require("../models/cart");

router.get("/", connLogin.ensureLoggedIn(), async (req, res) => {
  // get cart and populate all values
  let cart = await Cart.findOne({ user: req.user._id })
    .populate("content.product")
    .exec();

  // find cart info
  let subTotal = await cart.totalPrice();

  // make cart to object to put the values in
  cart = cart.toJSON();
  cart.subTotal = subTotal;

  // send object
  res.render("user/cart", {
    title: "Cart",
    user: req.user.toJSON(),
    cart: cart,
  });
});

router.get("/json", connLogin.ensureLoggedIn(), async (req, res) => {
  // get cart and populate all values
  let cart = await Cart.findOne({ user: req.user._id })
    .populate("content.product")
    .exec();

  // find cart info
  let subTotal = await cart.totalPrice();

  // make cart to object to put the values in
  cart = cart.toJSON();
  cart.subTotal = subTotal;

  // send object
  res.send(cart);
});

// add to cart method
router.post("/add/:id", connLogin.ensureLoggedIn(), async (req, res) => {
  // get user
  let user = req.user;

  let cart = await Cart.findOne({ user: user._id }).exec();

  console.log(req.body);

  let opt = req.body.opt;

  try {
    let item = await Item.findById(req.params.id);

    // add item to cart
    await cart.addItem(item, opt);

    res.redirect("back"); // use this for cart items
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// todo: update cart item route

// todo: submit order route

router.get("/clear", connLogin.ensureLoggedIn(), async (req, res) => {
  // get cart
  let cart = await Cart.findOne({ user: req.user._id }).exec();

  // emtpy cart
  cart.content = [];
  cart.cartCount = 0;

  // save to database
  await cart.save();

  res.redirect("back");
});

module.exports = router;
