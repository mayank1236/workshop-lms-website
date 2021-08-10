const mongoose = require('mongoose');
const passwordHash = require('password-hash');

let UserSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required:false
    },
    password:{
        type: String,
        required: true
    },
    token:{
        type:String,
        required:false,
        unique:true
    },
    type:{
        type:String,
        required:false,
        default:'User'
    },
    start: {
		type: Date,
		default: Date.now,
		required: false
	},
    status: {
        type: Boolean,
        required: false,
        default: true
    }
});
UserSchema.methods.comparePassword = function (candidatePassword) {
    return passwordHash.verify(candidatePassword, this.password);
}

module.exports = mongoose.model("all_users", UserSchema);