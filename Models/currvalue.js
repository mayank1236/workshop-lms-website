var mongoose = require('mongoose');
var moment = require("moment-timezone");
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");

const FaqsubcatSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    from:{
        type:String,
    }, //
    to:{
        type:String,
    }, //
    value:{
        type:Number,
    },
    created_on: {
        type: Date,
        default: dateKolkata,
    },

})

module.exports = mongoose.model("CurrencyValue",FaqsubcatSchema)