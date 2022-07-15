var mongoose = require("mongoose");
var moment = require("moment-timezone");

var Subsciption = require("../../Models/subscription");
var SubscribedBy = require("../../Models/subscr_purchase");
var User = require("../../Models/user");
const Curvalue = require("../../Models/currvalue");

const viewAllsubscription = async (req, res) => {
  return  Subsciption.aggregate([
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
                  { $eq: ["$subscr_id", mongoose.Types.ObjectId(req.params.id)] },
                  { $eq: ["$subscr_id", "$$subscr_id"] },
                  { $eq: ["$status", true] }
                ],
              },
            },
          },
        ],
        as: "subscribed_data",
      },
    },
    {
        $unwind: {
          path: "$subscribed_data",
          preserveNullAndEmptyArrays: true
        }
    },

    {
      $project: {
        _v: 0,
      },
    },
  ]).then( async data => {
      //console.log(data);
     

      // let newdata=data;
     

      // for (let index = 0; index < newdata.length; index++) {
      //   var element = newdata[index];
      //   //console.log("element:"+element);
      //   if (req.body.currency != "CAD") {


      //     let datass =await Curvalue.find({ from: "CAD", to: req.body.currency }).exec()

      //    // console.log(datass);

      //     let resuss = element.price * datass[0].value

      //     newdata[index].price = resuss

      //   }
      // }
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
        userid: { $in: [mongoose.Types.ObjectId(userid)] },
        status: true
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
          message: "Currently no user subscription.",
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
      currency:req.body.currency,
      subscribed_on: moment.tz(Date.now(), "Asia/Kolkata"),
      no_of_listing: req.body.no_of_listing
    }

    // if(req.query.currency!="CAD"){
    //   let conVert=await Curvalue.find({from:req.query.currency,to:"CAD"}).exec()
    //   let val=req.body.price*conVert[0].value
    //   userData.price=val.toFixed(2)
      
    // }
    // else{
    //   userData.price=req.body.price
    // }


    let new_subscription = new SubscribedBy(userData);

    return new_subscription
      .save()
      .then((data) => {  
        res.status(200).json({
          status: true,
          success: true,
          message: "New subscription applied successfully.",
          data: data,
        });
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

// cancel subscription and set user type to "User"
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
