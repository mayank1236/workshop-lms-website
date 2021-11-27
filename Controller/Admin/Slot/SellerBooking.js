var mongoose = require('mongoose');
var sellerBookings = require('../../../Models/Slot/seller_bookings');

var newBookings = async (req,res)=>{
    var new_bookings = await sellerBookings.aggregate(
        [
            {
                $match:{
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

var viewAcceptedBookings = async (req,res)=>{
    var accepted_bookings = await sellerBookings.aggregate(
        [
            {
                $match:{
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

var serviceBookingStat = async (req, res) => {
    var findTotalBookings = await sellerBookings.find({ }).exec();

    var totalBookingsCount = findTotalBookings.length;

    if (totalBookingsCount > 0) {
        var findAcceptedBookings = await sellerBookings.find({
            new_booking: false,
            booking_accept: true
        }).exec();
        var findRejectedBookings = await sellerBookings.find({
            new_booking: false,
            booking_accept: false
        }).exec();
        var findPendingBookings = await sellerBookings.find({
            new_booking: true,
            booking_accept: false,
        }).exec();

        var acceptedBookingsCount = findAcceptedBookings.length;
        var rejectedBookingsCount = findRejectedBookings.length;
        var pendingBookingsCount = findPendingBookings.length;

        return res.status(200).json({
            status: true,
            message: "All booking stats successfully get.",
            total_bookings: totalBookingsCount,
            accepted_bookings: acceptedBookingsCount,
            rejected_bookings: rejectedBookingsCount,
            pending_bookings: pendingBookingsCount
        });
    }
    else {
        return res.status(500).json({
            status: false,
            message: "This seller hasn't received any service booking.",
            total_bookings: 0,
            accepted_bookings: 0,
            rejected_bookings: 0,
            pending_bookings: 0
        });
    }
}

module.exports = {
    newBookings,
    viewAcceptedBookings,
    viewRejectedBookings,
    serviceBookingStat
}