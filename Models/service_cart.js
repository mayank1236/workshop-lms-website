var mongoose = require('mongoose')
var moment = require('moment-timezone')

const Schema = mongoose.Schema
const dateKolkata = moment.tz(Date.now(), "Asia/Kolkata")

const SERVICE_CART_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    user_booking_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    seller_id: mongoose.Schema.Types.ObjectId,
    service_id: mongoose.Schema.Types.ObjectId,
    slot_id: mongoose.Schema.Types.ObjectId,
    order_id: Number,
    rating: Number,
    service_name:{
        type: String,
        required: true
    },
    // service_category:String,
    price:{
        type: Number,
        required: true
    },
    discount_percent: {
        type: Number,
        default: 0
    },
    image: Array,
    seller_confirmed:{
        type: Boolean,
        default: false
    },
    status:{
        type:Boolean,
        default:true
    },
    refund_claim: {       // whether buyer can claim refund. Duration 3 days of seller accept
        type: Boolean,
        default: true
    },
    refund_request: {     // whether buyer has requested refund (within 3 ays of seller accept)
        type: String,
        default: ""
    },
    booking_date: {
        type: Date,
        default: dateKolkata
    },
    date_of_booking: Date
})

module.exports = mongoose.model("service_carts", SERVICE_CART_SCHEMA)