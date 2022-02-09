

const SERVICE_REFUND = require('../../Models/service_refund');

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

module.exports = {
    getAllRefundRequests
}