var mongoose = require('mongoose')
var moment = require('moment-timezone')
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata")
var Schema = mongoose.Schema

const CHECKOUT_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    // user_booking_id: mongoose.Schema.Types.ObjectId,
    // service_id: mongoose.Schema.Types.ObjectId,
    order_id:
    {
        type:Number
    },
    booking_date:{
        type: Date,
		default: dateKolkata,
		required: false
    },
    subtotal:{
        type:Number,
        required:true
    },
    discount_percent: Number,
    total: Number,           // subtotal - discount amount
    coupon_id:{
        type:mongoose.Schema.Types.ObjectId,
        required: false
    },
    coupon:{
        type: Object,
        required: false,
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: false
    },
    address1:{
        type:String,
        required:true
    },
    address2:{
        type:String,
        required: false
    },
    country:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    zip:{
        type:Number,
        required:true
    },
    payment_type:{
        type:String,
        required: false,
        default: "COD"
    },
    card_name:{
        type:String,
        required: false
    },
    card_no:{
        type:Number,
        required: false
    },
    exp_date:{
        type:String,
        required: false
    },
    cvv:{
        type:Number,
        required: false
    },
    status:{
        type:String,
        default:true
    },
    order_status:{
        type:String,
        default:'',
        required:false
    }
})

module.exports = mongoose.model("checkouts", CHECKOUT_SCHEMA)