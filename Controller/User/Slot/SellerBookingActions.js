var mongoose = require('mongoose');
var sellerSlots = require('../../../Models/Slot/seller_slots');
var sellerBookings = require('../../../Models/Slot/seller_bookings');
var userBookedSlot = require('../../../Models/Slot/user_booked_slot');
var userServiceCart = require('../../../Models/service_cart');
var Checkout = require('../../../Models/checkout');

const { Validator } = require('node-input-validator');

var newBookings = async (req,res)=>{
    var new_bookings = await sellerBookings.find({
        shop_service_id: req.params.shop_service_id,
        new_booking: true,
        booking_accept: false
    }).exec();
    console.log("New bookings: ", new_bookings);
    if (new_bookings==null || new_bookings=="") {
        return res.status(200).json({
            status: true,
            message: "No new bookings.",
            data: new_bookings
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "New bookings successfully get.",
            data: new_bookings
        });
    }
};

var acceptNewBooking = async (req,res)=>{
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
                var serviceCartData = await userServiceCart.findOne(
                    {
                        user_booking_id: docs.user_booking_id,
                        status: true
                    }
                ).exec();

                var checkoutData = await Checkout.findOne(
                    {
                        user_booking_id: docs.user_booking_id,
                        service_id: docs.shop_service_id
                    }
                ).exec();

                if (serviceCartData!=null && checkoutData==null) {
                    var cartStatusEdit = userServiceCart.findOneAndUpdate(
                        {
                            user_booking_id: docs.user_booking_id,
                            status: true
                        }, 
                        { $set:{ status: false } },
                        { returnNewDocument: true }
                    ).exec();
                }
                else if (serviceCartData==null && checkoutData!=null) {
                    // refund the booked session's amount
                    var checkoutStatusEdit = Checkout.findOneAndUpdate(
                        {
                            user_booking_id: docs.user_booking_id,
                            service_id: docs.shop_service_id
                        },
                        { $set:{ status: 'cancel' } },
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

module.exports = {
    newBookings,
    acceptNewBooking,
    rejectNewBooking
}