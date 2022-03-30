var mongoose = require('mongoose');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");

const SELLER_CHAT_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    rating: {
        type: Number,
        required: true
    },
    comment: String,
    tip: {
        type: Number,
        default: 0
    },
    currency: String,
    image: Array,
    created_on: {
        type: Date,
        default: dateKolkata
    }
});

module.exports = mongoose.model("chat_review", SELLER_CHAT_SCHEMA);