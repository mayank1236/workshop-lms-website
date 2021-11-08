var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CAREER_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    vacancy: Number,
    urgent: Boolean,
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("careers", CAREER_SCHEMA);