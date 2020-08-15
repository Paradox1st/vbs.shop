// import modules
const express = require("express");
const router = express.Router();
const connLogin = require("connect-ensure-login");
const isMod = require("../middleware/ismod");
const Order = require("../models/order");

// mod index page
router.get("/", connLogin.ensureLoggedIn(), isMod, (req, res) => {
  res.render("mod/menu", { user: req.user.toJSON() });
});

// mod orders page
router.get("/orders", connLogin.ensureLoggedIn(), isMod, async (req, res) => {
  try {
    // get user orders
    let orders = await Order.find()
      .sort({ date: -1 })
      .populate("user")
      .populate("products.product")
      .lean();

    res.render("user/orders", { user: req.user.toJSON(), orders });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// todo: users page

module.exports = router;
