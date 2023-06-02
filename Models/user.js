const { MongoServerClosedError } = require("mongodb");
const mongoose = require("mongoose");
const passwordHash = require("password-hash");

let UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
    },
    address: {
        type: String,
    },
    instagram: {
        type: String,
    },
    website: {
        type: String,
    }
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return passwordHash.verify(candidatePassword, this.password);
};

module.exports = mongoose.model("customers", UserSchema);
