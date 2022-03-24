var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const APPLICATION_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    job_id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    about_yourself: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    cv: {
        type: String,
        required: true
    },
    apply_status: {
        type: Boolean,
        default: false
    } 
});

module.exports = mongoose.model("job_application", APPLICATION_SCHEMA);