var mongoose = require('mongoose')
// var moment = require('moment-timezone')

var Schema = mongoose.Schema

const userBookedSlot = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    slot_id: mongoose.Schema.Types.ObjectId,
    shop_service_id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId,
    // seller_timing_id: mongoose.Schema.Types.ObjectId,
    date_of_booking: {
        type: Date,
    //     default: moment.tz(new Date(),"Asia/Kolkata"),//Date.now()
        required: true
    },
    shop_service_name:{
        type: String
    },
    // shop_service_category: String,
    price:{
        type: Number
    },
    price_cad:{
        type:Number,

    },
    image: Array,
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
    },
    order_id:{
        type:Number
    },
    paid: {
        type: Boolean,
        default: false
    },
   
});

// userBookedSlot.methods.pushToArray = function (emp_arr) {
//     return emp_arr.push(this);
// }

module.exports = mongoose.model('user_booked_slot', userBookedSlot)