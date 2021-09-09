var mongoose = require('mongoose');
var serviceReview = require('../../Models/service_review');

const { Validator } = require('node-input-validator');

var giveReview = async (req,res)=>{
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
        shopServiceData.comment = req.body.comment;
    }
    let subData = await Servicereview.findOne({
        service_id: mongoose.Types.ObjectId(req.body.service_id),
        user_id: mongoose.Types.ObjectId(req.body.user_id),
    }).exec();
    if (subData == null || subData == "") {
        let review = new Servicereview(shopServiceData);
        review
          .save()
          .then((docs) => {
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
            message: "Already reviewed",
            errors: null,
        });
      }
};

var getReviews = async (req,res)=>{};

module.exports = {
    giveReview,
    getReviews
};