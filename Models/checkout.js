var mongoose = require('mongoose')
var moment = require('moment-timezone')
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata")
var Schema = mongoose.Schema

const CHECKOUT_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    service_ids:{
        type: Array,
        required: true
    },
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
    discount_percent:{
        type:Number,
        required:false
    },
    total:{
        type:Number,
        required:true
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
        required:false
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
        required:true
    },
    card_name:{
        type:String,
        required:false
    },
    card_no:{
        type:Number,
        required:false
    },
    expdate:{
        type:String,
        required:false
    },
    cvv:{
        type:Number,
        required:false
    },
    status:{
        type:String,
        default:true
    }
})

module.exports = mongoose.model("checkouts", CHECKOUT_SCHEMA)