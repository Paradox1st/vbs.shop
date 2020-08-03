// import modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Item = require("./models/item");

// load config
dotenv.config({ path: "./config/config.env" });

// connect to db
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // create sample items
    const nintendoSwitch = new Item({
      prod_name: "Nintendo Switch Lite",
      prod_desc: "Not as powerful as the original Switch, but is good enough",
      prod_opts: ["black", "white", "blue", "red"],
      price: 1000,
    });

    const boringBook = new Item({
      prod_name: "Boring Book",
      prod_desc: "Rather boring book.",
      price: 10,
    });

    await nintendoSwitch.save();
    await boringBook.save();

    conn.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
