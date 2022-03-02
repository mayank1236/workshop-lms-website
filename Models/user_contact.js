var mongoose = require('mongoose');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;
var dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");

const USER_CONTACT_SCHEMA = new Schema({
    firstname: String, 
    lastname: String,
    user_email: String,
    reason: String,
    message: String,
    file: String,
    date: {
        type: Date,
        default: dateKolkata
    },
    rciv_mail: {
        type: String,
        default: 'tesdata.stack@gmail.com'
    },
    reply: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("usercontact", USER_CONTACT_SCHEMA);