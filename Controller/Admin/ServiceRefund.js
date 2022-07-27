var mongoose = require('mongoose');

const SERVICE_REFUND = require('../../Models/service_refund');
const SERVICE_SALE_EARNING = require('../../Models/earnings/service_sale_earnings');
const SERVICE_CART = require('../../Models/service_cart');
var Curvalue = require("../../Models/currvalue");

var getAllRefundRequests = async (req, res) => {
    let requests = await SERVICE_REFUND.aggregate([
        {
            $match: {
                 request_status: "new"
              
            }
        },
        {
            $lookup: {
                from: "service_carts",
                localField: "order_id",
                foreignField: "order_id",
                pipeline:[
                    {
                        $match: {
                            refund_claim:true 
                          
                        }
                    }, 
                ],
                as: "cart_items"
            }
        },
        {
            $unwind: "$cart_items"
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
                from: "users",
                localField: "seller_id",
                foreignField: "_id",
                as: "seller_details"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_details"
            }
        }
    ]).exec();
    console.log("Request data ", requests);

    if (requests.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: requests
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No active requests.",
            data: []
        });
    }
}

var approveRefund = async (req, res) => {
    var id = req.params.id;

    return SERVICE_REFUND.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { request_status: "approved" } },
        { new: true }
    )
        .then(docs => {
            console.log("Refund data ", docs);
            // SERVICE_CART.findOneAndUpdate(
            //     { _id: docs.cart_id },
            //     { $set: { refund_request: "Approved" } }
            // ).exec();

            SERVICE_SALE_EARNING.findOneAndUpdate(
                { cart_id: docs.cart_id },
                { $set: { refund_status: true } }
            ).exec();

            res.status(200).json({
                status: true,
                message: "Data successfully edited.",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            });
        });
}

var getApprovedRefundList = async (req, res) => {
    var approvedRefunds = await SERVICE_REFUND.aggregate([
        {
            $match: {
                request_status: "approved"
            }
        },
        {
            $lookup: {
                from: "service_carts",
                localField: "order_id",
                foreignField: "order_id",
                as: "cart_items"
            }
        },
        {
            $unwind: "$cart_items"
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
                from: "users",
                localField: "seller_id",
                foreignField: "_id",
                as: "seller_details"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_details"
            }
        }
    ]).exec();
   // console.log("Approved refunds ", approvedRefunds);
    

    if (approvedRefunds.length > 0) {

        let newRefund = approvedRefunds
        for (let index = 0; index < newRefund.length; index++) {
            let element = newRefund[index]
 //console.log("elemnt[" + index + "]" + element.cart_items.currency);
            if (element.cart_items.currency != 'CAD') {
                let data = await Curvalue.find({ from: element.cart_items.currency, to: "CAD" }).exec();


                let result = element.refund_amount * data[0].value
            newRefund[index].refund_amount = result.toFixed(2)


            }

        }
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: newRefund
        });

    }
    else {
        return res.status(200).json({
            status: true,
            message: "No approved request.",
            data: []
        });
    }
}

var rejectRefund = async (req, res) => {
    var id = req.params.id;

    return SERVICE_REFUND.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        {
            $set: {
                request_status: "rejected",
                admin_status: "refund_rejected"
            }
        },
        { new: true }
    )
        .then(docs => {
            SERVICE_CART.findOneAndUpdate(
                { _id: docs.cart_id },
                { $set: { refund_request: "Rejected" } }
            ).exec();

            res.status(200).json({
                status: true,
                message: "Data successfully edited.",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            });
        });
}

var adminInitiateRefund = async (req, res) => {
    var id = req.params.id;

    return SERVICE_REFUND.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { admin_status: "refund_initiated" } },
        { new: true }
    )
        .then(docs => {
            SERVICE_CART.findOneAndUpdate(
                { _id: docs.cart_id },
                { $set: { refund_request: "Refund initiated" } }
            ).exec();

            res.status(200).json({
                status: true,
                message: "Data successfully edited.",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err
            });
        });
}

module.exports = {
    getAllRefundRequests,
    approveRefund,
    getApprovedRefundList,
    rejectRefund,
    adminInitiateRefund
}