const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:mongoose.Schema.Types.ObjectId,
    prod_id:mongoose.Schema.Types.ObjectId,
    productname:{
        type:String,
        required:true
    },
    qty:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    image: Array
})

module.exports = mongoose.model('Cart',CartSchema);
