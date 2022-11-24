var mongoose = require('mongoose');
var moment = require("moment-timezone");
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");

const AddressSchema = new mongoose.Schema({
    address:{
        type:String,
        required:true,
    },
    created_on:{
        type: Date,
        default: dateKolkata,
    },
})

module.exports = mongoose.model("Address",AddressSchema)