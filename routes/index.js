// import modules
const express = require("express");
const router = express.Router();
const connLogin = require("connect-ensure-login");
const paginate = require("express-paginate");
const Item = require("../models/item");
const Cart = require("../models/cart");
const Order = require("../models/order");

// index page
router.get("/", async (req, res) => {
  try {
    // load user
    let user = req.user;
    let cart = {};

    if (user) {
      // get user cart
      cart = await Cart.findOne({ user: user._id }).exec();

      if (!cart) {
        cart = new Cart({
          user: user._id,
        });
        await cart.save();
        console.log(`Saved cart: ${cart}`);
      }

      // clean objects
      cart = cart.toJSON();
      user = user.toJSON();
    }

    // spotlight items (most expensive 3)
    let spotlight = await Item.find().sort({ price: -1 }).limit(3).lean();

    let queryOptions = {
      sort: { price: -1 },
      lean: true,
      offset: (req.query.page - 1) * req.query.limit,
      limit: req.query.limit,
    };
    const result = await Item.paginate({}, queryOptions);

    const pageCount = Math.ceil(result.total / result.limit);

    // build pagination object
    let pagination = {
      prev: paginate.href(req)(true),
      disablePrev: !res.locals.paginate.hasPreviousPages,
      next: paginate.href(req)(),
      disableNext: !paginate.hasNextPages(req)(pageCount),
      pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
      currentPage: req.query.page,
    };

    let args = {
      title: "VBS.shop",
      user: user,
      cart: cart,
      spotlight: spotlight,
      items: result.docs,
      pagination: pagination,
    };

    res.render("index", args);
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// login page
router.get("/login", (req, res) => {
  res.render("user/login");
});

router.get("/profile", connLogin.ensureLoggedIn(), async (req, res) => {
  try {
    // get user cart
    let cart = await Cart.findOne({ user: req.user._id }).lean();
    // get user
    let user = req.user.toJSON();

    res.render("user/profile", { user: user, cart: cart });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/orders", connLogin.ensureLoggedIn(), async (req, res) => {
  try {
    // get user orders
    let orders = await Order.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate("products.product")
      .lean();

    res.render("user/orders", { user: req.user.toJSON(), orders });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
