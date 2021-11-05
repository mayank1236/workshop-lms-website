var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ASSOCIATE_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("associates", ASSOCIATE_SCHEMA);