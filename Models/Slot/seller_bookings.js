var mongoose = require('mongoose')
var Schema = mongoose.Schema

const sellerBookingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    user_booking_id: mongoose.Schema.Types.ObjectId,
    date:{
        type: Date,
        default: Date()
    },
    day_name:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("seller_bookings", sellerBookingSchema)