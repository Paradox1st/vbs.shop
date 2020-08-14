// import modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Item = require("./models/item");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const glob = require("glob");

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

    // list to hold all created items
    var items = [];

    // read from csv
    fs.createReadStream(
      path.resolve(
        __dirname,
        "static",
        "images",
        "Amazing Savings",
        "Amazing Savings Talents.csv"
      )
    )
      .pipe(csv.parse({ headers: true }))
      // for every data entry
      .on("data", (row) => {
        // image name
        let imgName = row.name
          .substr(
            0,
            row.name.indexOf("(") >= 0 ? row.name.indexOf("(") : row.name.length
          )
          .trim();

        // search image folder with imgName
        let imgPaths = glob
          .sync(
            path.join(
              __dirname,
              "static",
              "images",
              "Amazing Savings",
              imgName
            ) + "*"
          )
          // trim to make relative to static dir
          .map((imgPath) => imgPath.substr(imgPath.indexOf("images")));

        // get item options
        row.opts = row.opts ? row.opts.split(",").map((opt) => opt.trim()) : [];

        // build new document
        let newItem = new Item({
          name: row.name,
          opts: row.opts,
          price: parseInt(row.talent),
          imgs: imgPaths,
        });

        // add to list of items
        items.push(newItem);
      })
      .on("end", async (rowCount) => {
        // add all items to database
        await Item.create(items, (err, docs) => {
          if (err) console.error(err);

          console.log(items.length + " items added");

          // disconnect from database
          conn.disconnect();
        });
      });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
