var mongoose = require('mongoose');
var serviceReview = require('../../Models/service_review');
var serviceCart = require('../../Models/service_cart');

const { Validator } = require('node-input-validator');

// user provides ratings in the order list of 'My account' section based on the last order
var giveOrderReview = async (req,res)=>{
    const V = new Validator(req.body, {
        rating: "required"
    });
    let matched = V.check().then(val=>val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }
    let serviceData = {
        _id: mongoose.Types.ObjectId(),
        service_id: mongoose.Types.ObjectId(req.body.service_id),
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        rating: Number(req.body.rating),
        order_id: req.body.order_id,
    };
    if (typeof req.body.comment != "undefined" || req.body.comment != "") {
        serviceData.comment = req.body.comment;
    }
    let subData = await serviceReview.findOne({
        // service_id: mongoose.Types.ObjectId(req.body.service_id),
        // user_id: mongoose.Types.ObjectId(req.body.user_id),
        order_id: req.body.order_id
    }).exec();
    if (subData == null || subData == "") {
        let review = new serviceReview(serviceData);
        review
          .save()
          .then((docs) => {
            serviceCart.updateMany(
              {
                service_id: docs.service_id, 
                user_id: docs.user_id, 
                order_id: docs.order_id
              },
              {$set: { rating: docs.rating }},
              {multi: true},
              (fault,result)=>{
                console.log(fault);
              }
            );

            res.status(200).json({
              status: true,
              message: "Review Saved sucessfully!",
              data: docs,
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: false,
              message: "Server error. Please try again",
              errors: err,
            });
          });
      }
      else {
        res.status(500).json({
            status: false,
            message: "Already reviewed for this order.",
            errors: null,
        });
      }
};

// user can provide a general review of the seller/service provider only once.
// The review can only be given if the user had availed the services of the 
// service provider (i.e. 'true' order status in checkouts)
// var giveSellerReview = async (req,res)=>{};

var getReviews = async (req,res)=>{
  return serviceReview.aggregate(
    [
      {
        $match:{
          service_id: mongoose.Types.ObjectId(req.params.serv_id)
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
      { $unwind: "$user_data" },
      {
        $project:{
          __v: 0
        }
      }
    ]
  )
  .then(data=>{
    if (data.length>0) {
      res.status(200).json({
        status: true,
        message: "Reviews get successfully",
        data: data
      });
    }
    else {
      res.status(200).json({
        status: true,
        message: "No reviews for this service.",
        data: data
      });
    }
  })
  .catch(err=>{
    res.status(500).json({
      status: false,
      message: "No match.",
      error: err
    });
  });
};

module.exports = {
  giveOrderReview,
  getReviews
};