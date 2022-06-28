const mongoose=require('mongoose');

const BlogSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    blog_type:{
        type:String,
        require:true
    }
})

module.exports=mongoose.model('blogType',BlogSchema);