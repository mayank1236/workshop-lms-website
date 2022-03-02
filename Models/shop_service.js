var mongoose = require('mongoose')
var moment = require('moment-timezone')

// const shop = require('./shop')
var Schema = mongoose.Schema
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata")

const ShopServiceSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    price:{
        type: Number,
        required: true
    },
    details:{
        type: String,
        required: true,
        index: true
    },
    personalization:{
        type: String,
        required: false
    },
    category_id: mongoose.Schema.Types.ObjectId,
    category_name:{
        type: String,
        index: true,
        required: false
    },
    user_id: mongoose.Schema.Types.ObjectId,
    hashtags: [],
    image: Array,
    video: String,
    status:{
        type: Boolean,
        default: true
    },
    created_on: {
        type: Date,
        default: dateKolkata
    }
})

// {
//     id: Number,
//     name: String
// }

ShopServiceSchema.indexes({ 
    name: 'text', 
    details: 'text', 
    category_name: 'text' 
})

module.exports = mongoose.model("shop_services", ShopServiceSchema);