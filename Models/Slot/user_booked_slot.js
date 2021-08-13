var mongoose = require('mongoose')
var Schema = mongoose.Schema

const userBookedSlot = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    seller_timing_id: mongoose.Schema.Types.ObjectId,
    date: {
        type: Date,
        default: Date.now()
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

userBookedSlot.methods.sellerAvailability = function (slot_book){}

module.exports = mongoose.model('user_booked_slot', userBookedSlot)