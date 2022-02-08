var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SELLER_EARNING_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    serv_id: mongoose.Schema.Types.ObjectId,
    // order_id: Number,
    admin_commision_percent: Number,
    total_earning: Number
});

module.exports = mongoose.model("seller_payable_earning", SELLER_EARNING_SCHEMA);