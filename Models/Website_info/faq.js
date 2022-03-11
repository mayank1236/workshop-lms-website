var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const FAQ_SCHEMA = new Schema({
    question:{
        type: String,
        required: true,
        unique: true
    },
    // question_two:{
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    answer:{
        type: String,
        required: true
    },
    // answer_two:{
    //     type: String,
    //     required: true
    // },
    image: String,
    audio: String
});

module.exports = mongoose.model("faqs", FAQ_SCHEMA);