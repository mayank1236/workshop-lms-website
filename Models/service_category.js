var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    admin_added: {
        type: Boolean,
        default: false
    },
    admin_approved: {
        type: Boolean,
        default: false
    },
    status:{
        type: Boolean,
        default: true,
    },
    image:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("service_categories", ServiceSchema);