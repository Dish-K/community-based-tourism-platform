const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: String,
  owner: String
});

module.exports = mongoose.model("Business", businessSchema);
