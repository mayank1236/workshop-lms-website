var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const SOCIAL_MEDIA_INFO_SCHEMA = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    facebook: String, 
    twitter: String,
    youtube: String,
    linkedin: String
});

module.exports = mongoose.model("social_medias", SOCIAL_MEDIA_INFO_SCHEMA);