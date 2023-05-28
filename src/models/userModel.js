const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
});

module.exports = mongoose.model("userName", userSchema);