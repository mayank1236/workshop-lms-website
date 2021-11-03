var mongoose = require('mongoose');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;

const BLOG_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    author: String,
    created_at: {
        type: Date,
        default: moment.tz(new Date(), "Asia/Kolkata")
    },
    image: {
        type: String,
        required: true
    },
    audio: String,
    blog_type: String
});

module.exports = mongoose.model('blogs', BLOG_SCHEMA);