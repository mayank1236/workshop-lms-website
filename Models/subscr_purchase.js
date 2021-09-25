var mongoose = require("mongoose");
var moment = require("moment-timezone");
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");

var userSubsriptionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  subscr_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  seller_comission: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  subscribed_on: {
    type: Date,
    default: dateKolkata,
  },
  no_of_listing:{
    type: Number,
    required: false
  },
  status: {
    type: Boolean,
    required: false,
    default: true,
  },
});

module.exports = mongoose.model("usersubscriptions", userSubsriptionSchema);
