var mongoose = require('mongoose')
var Checkout = require('../../Models/checkout')
var User = require('../../Models/user')
var ServiceCart = require('../../Models/service_cart')

var viewAll = async (req,res)=>{
    return Checkout.aggregate(
        [
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
                    from: "service_carts",
                    localField: "order_id",
                    foreignField: "order_id",
                    as: "cart_data"
                },
            },
            {
                $project:{
                    _v:0
                }
            }
        ]
    )
    .then(data=>{
        res.status(200).json({
            status: true,
            message: "Order History found successfully",
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