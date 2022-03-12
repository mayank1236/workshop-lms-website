var mongoose = require('mongoose');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");

const BLOG_COMMENT_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    blog_id: mongoose.Schema.Types.ObjectId,
    blog_type: {
        type: String,
        required: true
    },
    user_id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    image: Array,
    added_on: {
        type: Date,
        default: dateKolkata
    }
});

module.exports = mongoose.model("blog_comments", BLOG_COMMENT_SCHEMA);