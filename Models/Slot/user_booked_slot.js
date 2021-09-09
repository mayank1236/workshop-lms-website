var mongoose = require('mongoose')
var moment = require('moment-timezone')
var Schema = mongoose.Schema

var SellerBookings = require('./seller_bookings')

const userBookedSlot = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    slot_id: mongoose.Schema.Types.ObjectId,
    shop_service_id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    // seller_timing_id: mongoose.Schema.Types.ObjectId,
    date_of_booking: {
        type: Date,
        default: moment.tz(Date.now(),"Asia/Kolkata"),
        required: true
    },
    shop_service_name:{
        type: String
    },
    price:{
        type: Number
    },
    image:{
        type: String,
    },
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
    // is_booked:{
    //     type: Boolean,
    //     default: true
    // },
    seller_confirmed:{
        type: Boolean,
        default: false
    }
});

// userBookedSlot.methods.addToSellerBooking = function (slot_book){
//     console.log('data_from_booking_controller', slot_book)
//     let saveData = {
//         _id: mongoose.Types.ObjectId(),
//         seller_id: slot_book.seller_id,
//         user_id: slot_book.user_id,
//         user_booking_id: slot_book._id,
//         date: slot_book.date,
//         day_name: slot_book.day_name,
//         duration: slot_book.duration
//     }
//     console.log('booking_data', saveData);
//     let user_booking_data = new SellerBookings(saveData)

//     var insert = user_booking_data.save().exec()
//     if(insert){
//         return true
//     }
//     else{
//         return false
//     }
// }

module.exports = mongoose.model('user_booked_slot', userBookedSlot)