var mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    order_id:{
        type:Number
    },
    rating:{
        type: Number
    },
    service_name:{
        type: String,
        required: true
    },
    // service_category:String,
    price:{
        type: Number,
        required: true
    },
    image: Array,
    seller_confirmed:{
        type: String,
        default: false
    },
    status:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model("service_carts", SERVICE_CART_SCHEMA)