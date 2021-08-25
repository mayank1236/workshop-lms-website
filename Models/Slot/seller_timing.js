var mongoose = require('mongoose')
var Schema = mongoose.Schema

const sellerTimingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    day_name:{
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
    available_duration:{
        type: Number,
        required: true
    },
    booked:{               // Can be changed in future
        type: Boolean,
        default: false
    },
    slot_duration:{
        type: Array,
        required: false,
        default: [10,15,30]
    },
    shop_service_id: mongoose.Schema.Types.ObjectId,
    category_id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId
});

// sellerTimingSchema.methods.checkDayName = function(seller_day){
//     let availabilty = this.available_on
// }

module.exports = mongoose.model('seller_timings', sellerTimingSchema)