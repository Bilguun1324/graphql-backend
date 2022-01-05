const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: String,
  author: String,
  comment: [String],
});

module.exports = mongoose.model("testcollection", bookSchema);
