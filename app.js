// import modules
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

// load config
dotenv.config({ path: "./config/config.env" });

// configure passport
require("./config/passport")(passport);

// connect to mongoDB
connectDB();

// initialize express app
const app = express();

// logging (only for dev mode)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// handlebars use .hbs extension
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// sessions (also store in mongoDB)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "setosiafjoei233ju029",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// static folder
app.use(express.static(path.join(__dirname, "static")));

// routes
app.use("/", require("./routes/index"));
app.use("/cart", require("./routes/cart"));
app.use("/auth", require("./routes/auth"));
app.use("/mod", require("./routes/mod"));

// configure port
const PORT = process.env.PORT || 5000;

// start listening
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  )
);
