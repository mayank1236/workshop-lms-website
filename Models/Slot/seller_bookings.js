var mongoose = require('mongoose')
var Schema = mongoose.Schema

const sellerBookingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    seller_service_id: mongoose.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    user_booking_id: mongoose.Schema.Types.ObjectId,
    // date_of_booking:{
    //     type: String,
    //     // default: Date()
    //     required: true
    // },
    day_name_of_booking:{
        type: String,
        required: true
    },
    from:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    booked:{
        type: Boolean
    }
});

module.exports = mongoose.model("seller_bookings", sellerBookingSchema)