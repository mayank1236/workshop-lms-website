var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const COMPLAINT_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    heading1: {
        type: String,
        required: true
    },
    heading2: {
        type: String,
        required: true
    },
    content1: {
        type: String,
        required: true
    },
    content2: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("aboutbanner", COMPLAINT_SCHEMA);