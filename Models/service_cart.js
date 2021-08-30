var mongoose = require('mongoose')
const Schema = mongoose.Schema

const SERVICE_CART_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    service_id: mongoose.Schema.Types.ObjectId,
    slot_id: mongoose.Schema.Types.ObjectId,
    order_id:{
        type:Number
    },
    service_name:{
        type:String,
        required:true
    },
    
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model("service_carts", SERVICE_CART_SCHEMA)