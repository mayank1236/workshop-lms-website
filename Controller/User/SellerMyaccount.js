var mongoose = require('mongoose')
var Checkout = require('../../Models/checkout')
var User = require('../../Models/user')
var ServiceCart = require('../../Models/service_cart')

var viewAll = async (req,res)=>{
    return ServiceCart.aggregate(
        [
            {
                $match:{
                    seller_id: mongoose.Types.ObjectId(req.params.seller_id)
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
                $lookup: {
                    from: "shop_services",
                    localField: "service_id",
                    foreignField: "_id",
                    as: "service_data"
                }
            },
            {
                $project:{
                    __v: 0
                }
            }
        ]
    )
    .then(data=>{
        res.status(200).json({
            status: true,
            message: "All completed and pending orders successfully get.",
            data: data
        })
    })
    .catch(err=>{
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: err
        })
    })
}

module.exports = {
    viewAll
}