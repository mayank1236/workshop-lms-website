var mongoose = require("mongoose");
var moment = require("moment-timezone");
var jwt = require("jsonwebtoken");
var uuidv1 = require("uuid").v1;

var Subsciption = require("../../Models/subscription");
var SubscribedBy = require("../../Models/subscr_purchase");
var User = require("../../Models/user");

const viewAllsubscription = async (req, res) => {
  return Subsciption.aggregate([
    {
      $lookup: {
        from: "usersubscriptions",
        let: {
          subscr_id: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userid", mongoose.Types.ObjectId(req.params.id)] },
                  { $eq: ["$subscr_id", "$$subscr_id"] },
                  { $eq: ["$status", true] }
                ],
              },
            },
          },
        ],
        as: "speakers",
      },
    },
    {
      $project: {
        _v: 0,
      },
    },
  ])
    .then((data) => {
      res.status(200).json({
        status: true,
        message: "Subscription Data Get Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Server error. Please try again.",
        error: err,
      });
    });
};

var checkUserSubscription = async (req, res) => {
  let userid = req.params.id        // _id of 'users' table
  SubscribedBy.aggregate([
    {
      $match: {
        userid: { $in: [mongoose.Types.ObjectId(userid)] }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userid",
        foreignField: "_id",
        as: "user_data"
      }
    },
    {
      $project: {
        _v: 0
      }
    }
  ]).
    then(data => {
      if (data == null || data == '') {
        res.status(200).json({
          status: true,
          message: "No subscription purchased by user.",
          data: []
        })
      }
      else {
        res.status(200).json({
          status: true,
          message: "Subscription purchases by user.",
          data: data
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        status: false,
        message: "Server error. Please try again.",
        error: err
      })
    })
}

const newSubscription = async (req, res) => {
  let subData = await SubscribedBy.findOne({
    userid: mongoose.Types.ObjectId(req.body.userid),
    status: true,
  }).exec();
  if (subData == null || subData == "") {
    let userData = {
      _id: mongoose.Types.ObjectId(),
      userid: mongoose.Types.ObjectId(req.body.userid),
      subscr_id: mongoose.Types.ObjectId(req.body.subscr_id),
      seller_comission: req.body.seller_comission,
      price: req.body.price,
      subscribed_on: moment.tz(Date.now(), "Asia/Kolkata"),
      no_of_listing: req.body.no_of_listing
    }
    // subscription = await Subsciption.findOne({_id: {$in: [mongoose.Types.ObjectId(req.body.subscr_id)]}});
    // console.log(subscription)
    // listing_info = subscription.no_of_listing
    // console.log(listing_info)
    // userData.no_of_listing = listing_info

    let new_subscription = new SubscribedBy(userData);

    return new_subscription
      .save()
      .then((data) => {
        User.findOneAndUpdate(
          { _id: req.body.userid },
          {
            $set: { type: "Seller" },
          },
          {
            returnNewDocument: true,
          },
          function (error, result) {
            res.status(200).json({
              status: true,
              success: true,
              message: "New subscription applied successfully.",
              data: data,
            });
          }
        );
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          success: false,
          message: "Server error. Please try again.",
          error: err,
        });
      });
  } else {
    return res.status(500).json({
      status: false,
      success: false,
      message: "Subscription Exists",
    });
  }
};

const cancelSubscription = async (req, res) => {
  var user_id = req.params.user_id;

  return SubscribedBy.findOneAndUpdate(
    {
      userid: mongoose.Types.ObjectId(user_id), // [{ $in:  }] 
      status: true
    },
    { $set: { status: false } },
    { new: true }
  )
    .then(async (data) => {
      var edituserType = await User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(user_id) },
        { type: "User" }
      ).exec()

      res.status(200).json({
        status: true,
        message: "Subscription cancelled successfully.",
        data: data
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
  viewAllsubscription,
  checkUserSubscription,
  newSubscription,
  cancelSubscription
};
