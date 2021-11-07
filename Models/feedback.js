var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const FEEDBACK_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    phone: Number,
    email: {
        type: String,
        required: true
    },
    feedback_detail: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("user_feedbacks", FEEDBACK_SCHEMA);