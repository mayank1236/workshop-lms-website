var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const COMMISSION_SCHEMA = new Schema({
    seller_booking_id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    service_id: mongoose.Schema.Types.ObjectId,
    user_booking_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    cart_id: mongoose.Schema.Types.ObjectId,
    order_id: Number,
    seller_commission: Number,
    refund_status: {
        type: Boolean,
        default: false
    },
    claim_status: {
        type: Boolean,
        default: false
    },
    seller_apply: {
        type: Boolean,
        default: false
    },
    paystatus: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("service_sale_commission", COMMISSION_SCHEMA);