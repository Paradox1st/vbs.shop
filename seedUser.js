// import modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/user");

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

    let adminUser = new User({
      username: "admin",
      f_name: "Admin",
      talents: 9999999,
      mod: true,
    });

    await User.register(adminUser, "admin");

    let normalUser = new User({
      username: "test",
      f_name: "Test",
      talents: 2000,
    });

    await User.register(normalUser, "test");

    conn.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
