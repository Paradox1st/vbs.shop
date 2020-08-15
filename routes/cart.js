// import modules
const express = require("express");
const router = express.Router();
const connLogin = require("connect-ensure-login");
const url = require("url");
const Item = require("../models/item");
const Cart = require("../models/cart");
const Order = require("../models/order");

router.get("/", connLogin.ensureLoggedIn(), async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.render("error/500", { user: req.user.toJSON() });
  }
});

router.get("/json", connLogin.ensureLoggedIn(), async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.render("error/500", { user: req.user.toJSON() });
  }
});

// add to cart method
router.post("/add/:id", connLogin.ensureLoggedIn(), async (req, res) => {
  try {
    // get user
    let user = req.user;
    let opt = req.body.opt;
    let cart = await Cart.findOne({ user: user._id }).exec();
    let item = await Item.findById(req.params.id);

    // add item to cart
    let { info, infoType } = await cart.addItem(item, opt);

    res.redirect("/?info=" + info + "&infoType=" + infoType); // use this for cart items
  } catch (err) {
    console.error(err);
    res.render("error/500", { user: req.user.toJSON() });
  }
});

// todo: update cart item route
router.post("/update", connLogin.ensureLoggedIn(), async (req, res) => {
  try {
    // get user
    let user = req.user;

    let cart = await Cart.findOne({ user: user._id }).exec();

    // update item in cart
    let { info, infoType } = await cart.updateItem(req.body);

    res.redirect("/cart?info=" + info + "&infoType=" + infoType); // use this for cart items
  } catch (err) {
    console.error(err);
    res.render("error/500", { user: req.user.toJSON() });
  }
});

router.get("/order", connLogin.ensureLoggedIn(), async (req, res) => {
  try {
    // get user
    let user = req.user;

    let cart = await Cart.findOne({ user: req.user._id })
      .populate("content.product")
      .exec();

    let orderPrice = await cart.totalPrice();

    if (user.talents < orderPrice) {
      res.redirect(
        "/cart?info=" +
          "Not enough Talents to process order" +
          "&infoType=error"
      );
    } else {
      // build new order model
      let order = new Order({
        user: cart.user,
        products: cart.content,
        total: orderPrice,
      });

      console.log(order);

      await order.save();

      user.talents -= orderPrice;
      await user.save();

      res.redirect(
        "/cart/clear?info=" +
          "Order has been successfully submitted" +
          "&infoType=success"
      );
    }
  } catch (err) {
    console.error(err);
    res.render("error/500", { user: req.user.toJSON() });
  }
});

router.get("/clear", connLogin.ensureLoggedIn(), async (req, res) => {
  try {
    // get cart
    let cart = await Cart.findOne({ user: req.user._id }).exec();

    // emtpy cart
    cart.content = [];
    cart.cartCount = 0;

    // save to database
    await cart.save();

    if (req.query) {
      res.redirect(
        url.format({
          pathname: "/",
          query: req.query,
        })
      );
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.render("error/500", { user: req.user.toJSON() });
  }
});

module.exports = router;
