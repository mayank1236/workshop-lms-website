var mongoose = require('mongoose');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");

const ARTICLE_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    image: String,
    author: String,
    dated: {
        type: Date,
        default: dateKolkata
    }
});

module.exports = mongoose.model("article", ARTICLE_SCHEMA);