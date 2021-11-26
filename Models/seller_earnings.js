var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SELLER_EARNING_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    serv_id: mongoose.Schema.Types.ObjectId,
    order_id: Number,
    total_earning: Number,
    seller_earning: Number,
    commission: Number,
    images: Array,
    receipt_status: {
        type: String,
        default: "Requested"
    }
});

module.exports = mongoose.model("seller_earning", SELLER_EARNING_SCHEMA);