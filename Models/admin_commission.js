var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ADMIN_COMMISSION = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    percentage: Number,
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("admin_commission", ADMIN_COMMISSION);