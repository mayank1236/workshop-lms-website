var mongoose = require("mongoose");
var moment = require("moment-timezone");
var Schema = mongoose.Schema;

const SERVICE_REVIEW_SCHEMA = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: mongoose.Schema.Types.ObjectId,
  service_id: mongoose.Schema.Types.ObjectId,
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: String,
  order_id: Number,
  rev_date: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("service_reviews", SERVICE_REVIEW_SCHEMA);
