const MONGOOSE = require('mongoose');
var Schema = MONGOOSE.Schema;

const SELLER_SLOT_SCHEMA = new Schema({
    _id: MONGOOSE.Schema.Types.ObjectId,
    category_id: MONGOOSE.Schema.Types.ObjectId,
    shop_service_id: MONGOOSE.Schema.Types.ObjectId,
    weekday_name:{
        type: String,
        required: true
    },
    // from:{
    //     type: String,
    //     required: true
    // },
    // to:{
    //     type: String,
    //     required: true
    // },
    timing:{
        from:{
            type: String,
            required: true
        },
        to:{
            type: String,
            required: true
        } 
    },
    slot_duration:{
        type: Number
    },
    // booking_status:{
    //     type: Boolean,
    //     default: false
    // }
});

module.exports = MONGOOSE.model('seller_slots', SELLER_SLOT_SCHEMA);