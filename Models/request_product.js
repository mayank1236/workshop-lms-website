var mongoose = require('mongoose');

const ReqcategorySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
        unique:true
    }, //
    description:{
        type:String,
        required:true,
    }, //
    status:{
        type:Boolean,
        default:false
    }

})

module.exports = mongoose.model("RequestedCategory",ReqcategorySchema)