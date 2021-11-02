var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SAFETY_GUIDE_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    heading: String,
    description:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("safety_guides", SAFETY_GUIDE_SCHEMA);