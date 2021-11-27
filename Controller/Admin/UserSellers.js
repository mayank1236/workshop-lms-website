var mongoose = require('mongoose');

var User = require('../../Models/user');
var sellerBookings = require('../../Models/Slot/seller_bookings');

const viewUserList = async (req, res) => {
    return User.find(
        { type: { $in: "User" } },
        (err, docs) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Server error. Data not available",
                    error: err
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "Users get successfully",
                    data: docs
                });
            }
        });
}

const viewUser = async (req, res) => {
    let id = req.params.id;
    return User.findOne(
        { _id: { $in: [mongoose.Types.ObjectId(id)] } },
        (err, docs) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Server error. Data not available",
                    error: err
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "User get successfully",
                    data: docs
                });
            }
        });
}

const viewSellerList = async (req, res) => {
    return User.find(
        { type: { $in: "Seller" } },
        (err, docs) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Server error. Data not available",
                    error: err
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "Sellers get successfully",
                    data: docs
                });
            }
        });
}

const viewSeller = async (req, res) => {
    let id = req.params.id;
    return User.findOne(
        { _id: { $in: [mongoose.Types.ObjectId(id)] } },
        (err, docs) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Server error. Data not available",
                    error: err
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "Seller get successfully",
                    data: docs
                });
            }
        });
}

var selectTopSeller = async (req, res) => {
    var id = req.params.id;

    return User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { top_seller: true } },
        { new: true }
    )
        .then(data=>{
            res.status(200).json({
                status: true,
                message: "Data edited successfully.",
                data: data
            });
        })
        .catch(err=>{
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err
            });
        });
}

var bookingNUserStat = async (req, res) => {
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
        var findUsers = await User.find({type: "User"}).exec();
        var findSellers = await User.find({type: "Seller"}).exec();

        var acceptedBookingsCount = findAcceptedBookings.length;
        var rejectedBookingsCount = findRejectedBookings.length;
        var pendingBookingsCount = findPendingBookings.length;
        var userCount = findUsers.length;
        var sellerCount = findSellers.length;

        return res.status(200).json({
            status: true,
            message: "All booking stats successfully get.",
            total_bookings: totalBookingsCount,
            accepted_bookings: acceptedBookingsCount,
            rejected_bookings: rejectedBookingsCount,
            pending_bookings: pendingBookingsCount,
            user_count: userCount,
            seller_count: sellerCount
        });
    }
    else {
        return res.status(500).json({
            status: false,
            message: "This seller hasn't received any service booking.",
            total_bookings: 0,
            accepted_bookings: 0,
            rejected_bookings: 0,
            pending_bookings: 0,
            user_count: 0,
            seller_count: 0
        });
    }
}

module.exports = {
    viewUserList,
    viewUser,
    viewSellerList,
    viewSeller,
    selectTopSeller,
    bookingNUserStat
}