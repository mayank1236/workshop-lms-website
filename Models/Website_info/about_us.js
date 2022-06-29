var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ABOUT_US_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    heading: String,
    description:{
        type: String,
        required: true
    },
    image:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model("about_us_segments", ABOUT_US_SCHEMA);