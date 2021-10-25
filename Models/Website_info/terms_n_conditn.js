var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const WEBSITE_TERMS_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    heading: String,
    description:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("terms_segments", WEBSITE_TERMS_SCHEMA);