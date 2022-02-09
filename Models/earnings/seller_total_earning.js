var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SELLER_PAYABLE_SCHEMA = new Schema({
    seller_id: mongoose.Schema.Types.ObjectId,
    total_earning: Number,
    // withdrawn: Number,
    // refunded: Number
});

module.exports = mongoose.model("seller_total_earning", SELLER_PAYABLE_SCHEMA);