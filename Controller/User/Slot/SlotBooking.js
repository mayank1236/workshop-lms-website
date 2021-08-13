var mongoose = require('mongoose')
var UserBookedSlot = require('../../../Models/Slot/user_booked_slot')
var SellerBookings = require('../../../Models/Slot/seller_bookings')

const { Validator } = require('node-input-validator')

var bookSlot = async (req,res,next)=>{
    const v = new Validator(req.body,{
        day_name: "required",
        duration: "required"
    })

    let matched = v.check().then(val=>val)
    if(!matched){
        return res.status(400).json({ status: false, message: v.errors })
    }

    let saveData1 = {
        _id: mongoose.Types.ObjectId(),
        user_id: req.body.user_id,
        seller_id: req.body.seller_id,
        seller_timing_id: req.body.seller_timing_id,
        day_name: req.body.day_name,
        duration: req.body.duration
    }

    let slotBook = new UserBookedSlot(saveData1)
    
    return slotBook.save()
      .then(data => {
          // console.log('user_booking_data', data);
          let saveData2 = {
            _id: mongoose.Types.ObjectId(),
            seller_id: data.seller_id,
            user_id: data.user_id,
            user_booking_id: data._id,
            date: data.date,
            day_name: data.day_name,
            duration: data.duration
        }
        console.log('booking_data', saveData2);
        let user_booking_data = new SellerBookings(saveData2)
        user_booking_data.save()
          .then(result => {
            res.status(200).json({
                status: true,
                message: "Service slot booked successfully",
                data: data
            })
          })
          .catch(err => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            })
          })
      })
}

module.exports = {
    bookSlot
}