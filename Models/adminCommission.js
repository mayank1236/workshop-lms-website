var mongoose = require('mongoose');

const ADMIN_COMM = new mongoose.Schema({
    seller_booking_id: mongoose.Schema.Types.ObjectId,      
    seller_id: mongoose.Schema.Types.ObjectId,
      
    
    service_id:mongoose.Schema.Types.ObjectId,
      

    user_booking_id:mongoose.Schema.Types.ObjectId,
      
    
    user_id: mongoose.Schema.Types.ObjectId,
      
    cart_id:mongoose.Schema.Types.ObjectId,
      
    order_id:{
        type:Number
    },
    admin_commission:{
type:Number
    }
 
 
});

module.exports = mongoose.model("adminCommission", ADMIN_COMM);