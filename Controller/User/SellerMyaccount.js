var mongoose = require('mongoose')
// var Checkout = require('../../Models/checkout')
var User = require('../../Models/user')
var ServiceCart = require('../../Models/service_cart')

const viewAll = async (req,res)=>{
    return ServiceCart.find({
        seller_id: mongoose.Types.ObjectId(req.params.seller_id)
    })
    .then(data=>{
        if (data==null || data=='') {
            res.status(200).json({
                status: true,
                message: "Seller haven't received any order till date.",
                data: data
            })
        }
        else {
            res.status(200).json({
                status: true,
                message: "All completed and pending orders successfully get.",
                data: data
            })
        }
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