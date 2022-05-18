var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const COMPLAINT_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    heading: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("homebanner", COMPLAINT_SCHEMA);