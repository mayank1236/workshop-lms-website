var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const LEGAL_NOTICE_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    heading: String,
    description:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("legal_notices", LEGAL_NOTICE_SCHEMA);