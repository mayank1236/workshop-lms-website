const { MongoServerClosedError } = require("mongodb");
const mongoose = require("mongoose");
const passwordHash = require("password-hash");

let UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  transactionid: {
    type: String,
  },
  email: {
    type: String,
  },
});

module.exports = mongoose.model("transactions", UserSchema);
