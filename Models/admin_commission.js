var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ADMIN_COMMISSION = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category_id: mongoose.Schema.Types.ObjectId,
    percentage: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("admin_commissions", ADMIN_COMMISSION);