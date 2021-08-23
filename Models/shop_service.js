var mongoose = require('mongoose')
// const shop = require('./shop')
var Schema = mongoose.Schema

const ShopServiceSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true
    },
    details:{
        type: String,
        required: true
    },
    personalization:{
        type: String,
        required: false
    },
    category_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    hashtags:{
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    status:{
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("shop_services", ShopServiceSchema);