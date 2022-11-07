var mongoose = require("mongoose");
var sellerSlotSchema = require("./seller_slots");
var Schema = mongoose.Schema;

const sellerOffSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  offDate: {
    type: Date,
    required: true,
  },
  shop_service_id: mongoose.Schema.Types.ObjectId,
  category_id: mongoose.Schema.Types.ObjectId,
  seller_id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("sellerOff", sellerOffSchema);
