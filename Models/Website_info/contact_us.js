var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CONTACT_US_INFO_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    phone: Number,
    address: String
});

module.exports = mongoose.model("contact-us_infos", CONTACT_US_INFO_SCHEMA);