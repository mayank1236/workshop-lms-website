var mongoose = require('mongoose')

var ServiceCart = require('../../Models/service_cart')
var SellerBookings = require('../../Models/Slot/seller_bookings')
const SERVICE_SALE_EARNINGS = require('../../Models/earnings/service_sale_earnings');
const SELLER_TOTAL_EARNINGS = require('../../Models/earnings/seller_total_earning');

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
                    from: "seller_earnings",
                    localField: "service_id",
                    foreignField: "serv_id",
                    as: "earning_data"
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

var wallet = async (req, res) => {
    var id = req.params.id

    /**----------------------------- Total earnings -----------------------------*/
    let commissionData = await SERVICE_SALE_EARNINGS.find({ seller_id: mongoose.Types.ObjectId(id) }).exec()

    var totalEarnings = 0

    commissionData.forEach(element => {
        totalEarnings = parseInt(totalEarnings) + parseInt(element.seller_commission);
    })
    /**--------------------------------------------------------------------------*/

    /**----------------------------- Settled earning-----------------------------*/
    let settledEarningData = await SERVICE_SALE_EARNINGS.find({
        seller_id: mongoose.Types.ObjectId(id),
        refund_status: false,
        claim_status: true,
        seller_apply: true,
        paystatus: true
    }).exec()

    var settledEarning = 0

    if (settledEarningData.length > 0) {
        settledEarningData.forEach(element => {
            settledEarning = parseInt(settledEarning) + parseInt(element.seller_commission)
        })
    }
    else {
        settledEarning = 0
    }
    /**--------------------------------------------------------------------------*/

    /**--------------------------- Pending settlement ---------------------------*/
    let pendingSettlementData = await SERVICE_SALE_EARNINGS.find({
        seller_id: mongoose.Types.ObjectId(id),
        refund_status: false,
        claim_status: false,
        seller_apply: false,
        paystatus: false
    }).exec()
    console.log("Pending settlement data ", pendingSettlementData);

    var pendingSettlement = 0

    if (pendingSettlementData.length > 0) {
        pendingSettlementData.forEach(element => {
            pendingSettlement = parseInt(pendingSettlement) + parseInt(element.seller_commission)
        })
    }
    else {
        pendingSettlement = 0
    }
    /**--------------------------------------------------------------------------*/

    /**--------------------------- Claimable earnings ---------------------------*/
    let claimableEarningData = await SERVICE_SALE_EARNINGS.find({
        seller_id: mongoose.Types.ObjectId(id),
        claim_status: true,
        seller_apply: false
    }).exec()

    var claimableEarning = 0

    if (claimableEarningData.length > 0) {
        claimableEarningData.forEach(element => {
            claimableEarning = parseInt(claimableEarning) + parseInt(element.seller_commission);
        })
    }
    else {
        claimableEarning = 0
    }
    /**--------------------------------------------------------------------------*/

    res.send({
        total_earnings: totalEarnings,
        earning_settled: settledEarning,
        pending_settlement: pendingSettlement,
        service_refund_amt: 0,
        claimable_earnings: claimableEarning
    })
}

var claimableCommissions = async (req, res) => {
    var id = req.params.id

    let claimableEarningData = await SERVICE_SALE_EARNINGS.find({
        seller_id: mongoose.Types.ObjectId(id),
        claim_status: true
    }).exec()

    // var claimableEarning = 0

    if (claimableEarningData.length > 0) {
        // claimableEarningData.forEach(element => {
        //     claimableEarning = parseInt(claimableEarning) + parseInt(element.seller_commission);
        // })

        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            service_data: claimableEarningData
        })
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No service earning to be claimed.",
            service_data: []
        })
    }
}

var claimOneCommission = async (req, res) => {
    var id = req.params.id

    return SERVICE_SALE_EARNINGS.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { seller_apply: true } },
        { new: true }
    )
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data successfully edited.",
                data: docs
            })
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            })
        })
}

var claimAllCommissions = async (req,res) => {
    var id = req.params.id

    return SERVICE_SALE_EARNINGS.updateMany(
        {
            seller_id: mongoose.Types.ObjectId(id), 
            claim_status: true,
            seller_apply: false,
        },
        { $set: { seller_apply: true } }, 
        { multi: true }, 
        (err,result) => {
            if (!err) {
                res.status(200).json({
                    status: 200,
                    message: "All data successfully edited.",
                    data: result
                })
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Invalid id. Server error",
                    error: err.message
                })
            }
        }
    )
} 

module.exports = {
    viewAll,
    serviceBookingStat,
    wallet,
    claimableCommissions,
    claimOneCommission,
    claimAllCommissions
}