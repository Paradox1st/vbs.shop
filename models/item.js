// import modules
const mongoose = require("mongoose");

// declare schema
const ItemSchema = new mongoose.Schema({
  prod_name: {type:String, required: true,},
  prod_desc: {type:String, required: true,},
  prod_opts: [{type:String, required: false,}],
  price: {type:Number,required: true},
});

// export userschema
module.exports = mongoose.model("Item", ItemSchema);
