var mongoose = require('mongoose');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");

const TESTIMONIAL_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    heading: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: dateKolkata
    }
});

module.exports = mongoose.model("testimonial", TESTIMONIAL_SCHEMA);