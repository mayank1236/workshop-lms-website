var mongoose = require('mongoose')
// var moment = require('moment-timezone')
var Schema = mongoose.Schema

const sellerBookingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_booking_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    slot_id: mongoose.Schema.Types.ObjectId,
    shop_service_id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    order_id: Number,
    date_of_booking: Date,
        // default: moment.tz(new Date(), "Asia/Kolkata"),//Date.now()
        // required: true
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
    new_booking:{
        type: Boolean,
        default: true
    },
    booking_accept:{
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("seller_bookings", sellerBookingSchema)