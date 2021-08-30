var mongoose = require('mongoose')
var ServiceCart = require('../../Models/service_cart')
var Service = require('../../Models/shop_service')
const User = require('../../Models/user')
const Upload = require('../../service/upload')

const { Validator } = require('node-input-validator')

var addToServiceCart = async (req,res)=>{
    const V = new Validator(req.body, {
        seller_id: "required",
        service_id: "required",
        service_name: "required",
        price: "required",
        image: "required"
    })
    let matched = V.check().then(val=>val)
    if (!matched) {
        res.status(400).json({ status: false, error: V.errors })
    }

    // let image_url = await Upload.uploadFile(req.file, "service_cart")
    let cartData = await ServiceCart.findOne({
        user_id: mongoose.Types.ObjectId(req.body.seller_id),
        service_id: mongoose.Types.ObjectId(req.body.service_id),
        status: true
    }).exec()
    if(cartData==null || cartData=='') {

        let saveData = {
            _id: mongoose.Types.ObjectId(),
            user_id: req.body.user_id,
            seller_id: req.body.seller_id,
            service_id: req.body.service_id,
            order_id: req.body.order_id,
            service_name: req.body.service_name,
            price: req.body.price,
            image: req.body.image
        }

        const SERVICE_CART = new ServiceCart(saveData)

        return SERVICE_CART
          .save()
          .then(data=>{
              res.status(200).json({
                  status: true,
                  message: "Service request successfully added to cart",
                  data: data
              })
          })
          .catch(err=>{
              res.status(500).json({
                  status: false,
                  message: "Couldn't add service request to cart. Server error",
                  error: err
              })
          })
    }
    else {
        res.status(400).json({
            status: false,
            message: "Service request has already been added to cart.",
            data: null
        })
    }
}

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
    addToServiceCart,
    getServiceCart,
    DeleteCart
}