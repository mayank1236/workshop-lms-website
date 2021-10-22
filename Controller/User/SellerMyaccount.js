var mongoose = require('mongoose')
var ServiceCart = require('../../Models/service_cart')
var SellerBookings = require('../../Models/Slot/seller_bookings')

var viewAll = async (req, res) => {
    return ServiceCart.aggregate(
        [
            {
                $match: {
                    seller_id: mongoose.Types.ObjectId(req.params.seller_id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $lookup: {
                    from: "shop_services",
                    localField: "service_id",
                    foreignField: "_id",
                    as: "service_data"
                }
            },
            {
                $lookup: {
                    from: "admin_commissions",
                    localField: "service_id",
                    foreignField: "service_id",
                    as: "admin_commission"
                }
            },
            {
                $project: {
                    __v: 0
                }
            }
        ]
    )
        .then(data => {
            res.status(200).json({
                status: true,
                message: "All completed and pending orders successfully get.",
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
}

var serviceBookingStat = async (req, res) => {
    var id = req.params.seller_id
    var findTotalBookings = await SellerBookings.find({ seller_id: mongoose.Types.ObjectId(id) }).exec()

    var totalBookingsCount = findTotalBookings.length

    if (totalBookingsCount > 0) {
        var findAcceptedBookings = await SellerBookings.find({
            new_booking: false,
            booking_accept: true,
            seller_id: mongoose.Types.ObjectId(id)
        }).exec()
        var findRejectedBookings = await SellerBookings.find({
            new_booking: false,
            booking_accept: false,
            seller_id: mongoose.Types.ObjectId(id)
        }).exec()
        var findPendingBookings = await SellerBookings.find({
            new_booking: true,
            booking_accept: false,
            seller_id: mongoose.Types.ObjectId(id)
        }).exec()

        var acceptedBookingsCount = findAcceptedBookings.length
        var rejectedBookingsCount = findRejectedBookings.length
        var pendingBookingsCount = findPendingBookings.length

        return res.status(200).json({
            status: true,
            message: "All booking stats successfully get.",
            total_bookings: totalBookingsCount,
            accepted_bookings: acceptedBookingsCount,
            rejected_bookings: rejectedBookingsCount,
            pending_bookings: pendingBookingsCount
        })
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
    viewAll,
    serviceBookingStat
}