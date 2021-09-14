var mongoose = require('mongoose');
var sellerSlots = require('../../../Models/Slot/seller_slots');
var sellerBookings = require('../../../Models/Slot/seller_bookings');
var userBookedSlot = require('../../../Models/Slot/user_booked_slot');
var userServiceCart = require('../../../Models/service_cart');

const { Validator } = require('node-input-validator');

var newBookings = async (req,res)=>{
    var new_bookings = await sellerBookings.aggregate(
        [
            {
                $match:{
                    seller_id: mongoose.Types.ObjectId(req.params.seller_id),
                    new_booking: true,
                    booking_accept: false
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $lookup:{
                    from: "shop_services",
                    localField: "shop_service_id",
                    foreignField: "_id",
                    as: "shopservice_data"
                }
            },
            {
                $project:{
                    __v: 0
                }
            }
        ]
    ).exec();
    
    if (new_bookings.length>0) {
        return res.status(200).json({
            status: true,
            message: "New bookings successfully get.",
            data: new_bookings
        });
    }
    else {
        res.status(200).json({
            status: true,
            message: "No new bookings",
            data: new_bookings
        });
    }
};

var acceptNewBooking = async (req,res)=>{
    sellerBookings.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
      .then(async (data)=>{
          console.log("Seller booking details ", data);
          var payment_status = await userServiceCart.findOne(
              {
                  user_booking_id: data.user_booking_id,
                  status: false
              }
          ).exec();
          console.log("Service cart data ", payment_status);

          if (payment_status==null || payment_status=="") {
            return res.status(500).json({
                status: false,
                message: "Payment not yet made. Can't accept booking.",
                data: "Item still in cart. Order not placed."
            });
          }
          else {
            return sellerBookings.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(req.params.id), 
                    new_booking: true, 
                    booking_accept: false
                }, 
                {
                    $set:{
                        new_booking: false,
                        booking_accept: true
                    }
                },
                {
                    returnNewDocument: true
                },
                (err,docs)=>{
                    if (!err) {
                        var userBookedSlotData = userBookedSlot.findOneAndUpdate(
                            {
                                _id: docs.user_booking_id, 
                                slot_id: docs.slot_id
                            }, 
                            { $set:{ seller_confirmed: true } }, 
                            { returnNewDocument: true }
                        ).exec();
        
                        var serviceCartData = userServiceCart.findOneAndUpdate(
                            { 
                                user_booking_id: docs.user_booking_id, 
                                slot_id: docs.slot_id
                            }, 
                            { $set:{ seller_confirmed: true } }, 
                            { returnNewDocument: true }
                        ).exec();
        
                        //
                        res.status(200).json({
                            status: true,
                            message: "Booking accepted.",
                            data: docs
                        });
                    }
                    else {
                        res.status(500).json({
                            status: false,
                            message: "Failed to accept booking. Server error.",
                            error: err
                        });
                    }
                }
            );
          }
      })
};

var viewAcceptedBookings = async (req,res)=>{
    var accepted_bookings = await sellerBookings.aggregate(
        [
            {
                $match:{
                    seller_id: mongoose.Types.ObjectId(req.params.seller_id),
                    new_booking: false,
                    booking_accept: true
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $lookup:{
                    from: "shop_services",
                    localField: "shop_service_id",
                    foreignField: "_id",
                    as: "shopservice_data"
                }
            },
            {
                $project:{
                    __v: 0
                }
            }
        ]
    ).exec();

    if (accepted_bookings.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All accepted bookings successfully get.",
            data: accepted_bookings
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No bookings accepted till date.",
            data: accepted_bookings
        });
    }
};

var rejectNewBooking = async (req,res)=>{
    return sellerBookings.findOneAndUpdate(
        {
            _id: mongoose.Types.ObjectId(req.params.id), 
            new_booking: true, 
            booking_accept: false
        }, 
        {
            $set:{
                new_booking: false,
                booking_accept: false
            }
        },
        {
            returnNewDocument: true
        },
        async (err,docs)=>{
            if (!err) {
                console.log("Seller booking", docs);
                // cancel seller slot booking
                var sellerSlotData = sellerSlots.findOneAndUpdate(
                    {
                        _id: docs.slot_id,
                        booking_status: true
                    },
                    { $set:{ booking_status: false } },
                    { returnNewDocument: true }
                ).exec();
                
                // if booked service is still in service cart
                var inServiceCart = await userServiceCart.findOne(
                    {
                        user_booking_id: docs.user_booking_id,
                        status: true
                    }
                ).exec();
                // if booked service has been checked out
                var checkedOut = await userServiceCart.findOne(
                    {
                        user_booking_id: docs.user_booking_id,
                        status: false
                    }
                ).exec();

                // var checkoutData = await Checkout.findOne(
                //     {
                //         user_booking_id: docs.user_booking_id,
                //         service_id: docs.shop_service_id
                //     }
                // ).exec();

                if (inServiceCart!=null && checkedOut==null) {
                    var bookingStatus = userServiceCart.findOneAndUpdate(
                        {
                            user_booking_id: docs.user_booking_id,
                            status: true
                        }, 
                        { $set:{ status: false, seller_confirmed: 'cancelled' } },
                        { returnNewDocument: true }
                    ).exec();
                }
                else if (inServiceCart==null && checkedOut!=null) {
                    // refund the booked session's amount
                    var bookingStatus = userServiceCart.findOneAndUpdate(
                        {
                            user_booking_id: docs.user_booking_id,
                            status: false
                        },
                        { $set:{ seller_confirmed: 'cancelled' } },
                        { returnNewDocument: true }
                    ).exec();
                }

                res.status(200).json({
                    status: true,
                    message: "Booking rejected",
                    data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Failed to reject booking. Server error.",
                    error: err
                });
            }
        }
    );
};

var viewRejectedBookings = async (req,res)=>{
    var accepted_bookings = await sellerBookings.aggregate(
        [
            {
                $match:{
                    seller_id: mongoose.Types.ObjectId(req.params.seller_id),
                    new_booking: false,
                    booking_accept: false
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $lookup:{
                    from: "shop_services",
                    localField: "shop_service_id",
                    foreignField: "_id",
                    as: "shopservice_data"
                }
            },
            {
                $project:{
                    __v: 0
                }
            }
        ]
    ).exec();

    if (accepted_bookings.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All rejected bookings successfully get.",
            data: accepted_bookings
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No bookings rejected till date.",
            data: accepted_bookings
        });
    }
};

module.exports = {
    newBookings,
    acceptNewBooking,
    viewAcceptedBookings,
    rejectNewBooking,
    viewRejectedBookings
}