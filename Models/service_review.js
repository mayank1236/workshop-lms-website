var mongoose = require('mongoose');
var moment = require('moment-timezone');
var Schema = mongoose.Schema;

const SERVICE_REVIEW_SCHEMA = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    service_id:mongoose.Schema.Types.ObjectId,
    user_id:mongoose.Schema.Types.ObjectId,
    seller_id:mongoose.Schema.Types.ObjectId,
    rating:{
        type:Number,
        required: true
    }, 
    comment:{
        type:String,
    },
    order_id:{
        type:Number
    },
    rev_date:{
        type: Date,
		default: moment.tz(Date.now(), "Asia/Kolkata"),
		required: false
    }
});

module.exports = mongoose.model("service_reviews", SERVICE_REVIEW_SCHEMA);