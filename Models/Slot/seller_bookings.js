var mongoose = require('mongoose')
var Schema = mongoose.Schema

const sellerBookingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    seller_service_id: mongoose.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    user_booking_id: mongoose.Schema.Types.ObjectId,
    date_of_apply:{
        type: Date,
        default: Date()
    },
    day_name_of_booking:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    appointment:{
        type: String,
        default: 'Scheduled'
    }
});

module.exports = mongoose.model("seller_bookings", sellerBookingSchema)