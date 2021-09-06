var mongoose = require('mongoose')
var Checkout = require('../../Models/checkout')
var User = require('../../Models/user')
var ServiceCart = require('../../Models/service_cart')
var userBookedSlot = require('../../Models/Slot/user_booked_slot')
var sellerSlots = require('../../Models/Slot/seller_slots')

var viewAll = async (req,res)=>{
    return Checkout.aggregate(
        [
            {
                $match:{
                    user_id: mongoose.Types.ObjectId(req.params.user_id),
                }
            },
            {
                $lookup:{
                    from:"service_carts",//
                    localField:"order_id",//
                    foreignField:"order_id",
                    as:"cart_data"//
                }
            },
            {
                $project:{
                    _v:0
                }
            }
        ]
    )
    .then((docs)=>{
        res.status(200).json({
            status: true,
            message: "Order History get successfully",
            data: docs
        })
    })
    .catch((err)=>{
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: err
        })
    })
}

var cancelBooking = async (req,res)=>{
    return Checkout.findOneAndUpdate(
        {_id: {$in: [mongoose.Types.ObjectId(req.params.id)]}},
        { $set:{ status: 'cancel' } },
        { returnNewDocument: true },
        (err,docs)=>{
            if (!err) {
                userBookedSlot.findOne({_id: {$in: docs.user_booking_id}})
                  .then(data=>{
                      console.log("User booking data", data)
                      var sellerSlotData = sellerSlots.findOneAndUpdate(
                          { _id: { $in: data.slot_id } },
                          { $set: { booking_status: false } },
                          { returnNewDocument: true }
                      ).exec();

                      res.status(200).json({
                          status: true,
                          message: "Booking cancelled. Amount will be refunded.",
                          data: docs
                      })
                  })
                  .catch(fault=>{
                      res.status(500).json({
                          status: false,
                          message: "Failed to free the seller slot. Slot still booked.",
                          error: fault
                      })
                  })
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Failed to cancel booking. Server error.",
                    error: err
                })
            }
        }
    )
}

module.exports = {
    viewAll,
    cancelBooking
}