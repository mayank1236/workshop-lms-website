var mongoose = require('mongoose')
var sellerSlotSchema = require('./seller_slots')
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
        type: Number
    },
    slot_duration:{
        type: Number,
        required: true
    },
    language:{
        type: String,
        required: true
    },
    shop_service_id: mongoose.Schema.Types.ObjectId,
    category_id: mongoose.Schema.Types.ObjectId,
    seller_id: mongoose.Schema.Types.ObjectId
});

// sellerTimingSchema.methods.checkDayName = function(seller_day){
//     let availabilty = this.available_on
// }

sellerTimingSchema.methods.addSlots = function(data) {
    const SELLER_SLOTS = new sellerSlotSchema(data)
    return SELLER_SLOTS.save()
}

module.exports = mongoose.model('seller_timing', sellerTimingSchema)