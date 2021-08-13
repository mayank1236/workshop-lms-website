var mongoose = require('mongoose')
var UserBookedSlot = require('../../../Models/Slot/user_booked_slot')

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

    let saveData = {
        _id: mongoose.Types.ObjectId(),
        user_id: req.body.user_id,
        seller_slot_id: req.body.seller_slot_id,
        day_name: req.body.day_name,
        duration: req.body.duration
    }

    let slotBook = new UserBookedSlot(saveData)

    return slotBook.saveData()
      .then(data => {
          UserBookedSlot.sellerAvailability(data)
      })
}