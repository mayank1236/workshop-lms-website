var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PRIVACY_POLICY_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    heading: String,
    description:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("privacy_policies", PRIVACY_POLICY_SCHEMA);