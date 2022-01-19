var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const ADMIN_EARNING_SCHEMA = new Schema({
    booking_id: mongoose.Schema.Types.ObjectId,
    order_id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    service_id: mongoose.Schema.Types.ObjectId,
    price:{
        type: Number,
        required: true
    },
    commission:{
        type: Number,
        required: true
    },
    earning:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("admin_earning", ADMIN_EARNING_SCHEMA);