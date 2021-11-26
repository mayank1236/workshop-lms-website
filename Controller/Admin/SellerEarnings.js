var mongoose = require('mongoose');

const SELLER_EARNINGS = require('../../Models/seller_earnings');

var viewAllServiceEarnings = async (req, res) => {
    return SELLER_EARNINGS.aggregate([
        // {
        //     $lookup: {
        //         from: "service_carts",
        //         localField: {$in: ["serv_id", "order_id"]},
        //         foreignField: {$in: ["service_id", "order_id"]},
        //         as: "cart_data"
        //     }
        // },
        {
            $lookup: {
                from: "users",
                localField: "seller_id",
                foreignField: "_id",
                as: "seller_data"
            }
        },
        {
            $unwind: "$seller_data"
        },
        {
            $lookup: {
                from: "shop_services",
                localField: "serv_id",
                foreignField: "_id",
                as: "service_data"
            }
        },
        {
            $unwind: "$service_data"
        },
        {
            $lookup: {
                from: "admin_commissions",
                localField: "serv_id",
                foreignField: "service_id",
                as: "commission_data"
            }
        },
        {
            $unwind: "$commission_data"
        },
        {
            $project: {
                __v: 0
            }
        }
    ])
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data successfully get.",
                data: docs
            });
        })
        .catch(err => {
            res.status(200).json({
                status: false,
                message: "Failed to get data. Server error.",
                error: err.message
            });
        });
}

var approveServiceEarnings = async (req, res) => {
    var id = req.params.id;

    return SELLER_EARNINGS.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },   // [{ $in:  }]
        { $set: { receipt_status: "Approved" } },
        { new: true }
    )
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data successfully edited.",
                data: docs
            });
        })
        .catch(err => {
            res.status(200).json({
                status: false,
                message: "Invalid. Server error.",
                error: err.message
            });
        });
}

module.exports = {
    viewAllServiceEarnings,
    approveServiceEarnings
}