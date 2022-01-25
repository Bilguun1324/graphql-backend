const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: String,
  author: String,
  about: String,
  comment: [String],
  img_url: String,
});

module.exports = mongoose.model("testcollection", bookSchema);
