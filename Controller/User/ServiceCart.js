var mongoose = require('mongoose')
var ServiceCart = require('../../Models/service_cart')
var Service = require('../../Models/shop_service')
const User = require('../../Models/user')
const Upload = require('../../service/upload')

const { Validator } = require('node-input-validator')

var  getServiceCart = async (req,res)=>{
    return ServiceCart.aggregate([
        {
            $match:{
                user_id: mongoose.Types.ObjectId(req.params.user_id),
                status: true
            },
        },
        {
            $lookup:{
                from: "users",
                localField: "seller_id",
                foreignField: "_id",
                as: "seller_data"
            }
        },
        {
            $project:{
                _v: 0
            }
        }
    ]).then(data=>{
        if (data.length > 0) {
            res.status(200).json({
              status: true,
              message: "Service cart listing successfully get",
              data: data,
            })
          } else {
            res.status(200).json({
              status: true,
              message: "Empty ServiceCart",
              data: data,
            })
          }
    }).catch((err) => {
        res.status(500).json({
          status: false,
          message: "No Match",
          data: null,
        })
      })
}

var DeleteCart = async (req,res)=>{
    return ServiceCart.deleteOne({_id: {$in: [mongoose.Types.ObjectId(req.params.id)]}})
      .then(data=>{
          res.status(200).json({
              status: true,
              message: "Cart item deleted successfully.",
              data: data
          })
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: "Server error. Please try again.",
          error: err,
        })
      })
}

module.exports = {
    getServiceCart,
    DeleteCart
}