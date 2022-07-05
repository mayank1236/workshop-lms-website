var mongoose = require("mongoose");
const { Validator } = require("node-input-validator");

var Subsciption = require("../../Models/subscription");
var SubscribedBy = require("../../Models/subscr_purchase");
const Curvalue = require("../../Models/currvalue");

const create = async (req, res) => {
  let v = new Validator(req.body, {
    name: "required",
    description: "required",
    seller_comission: "required",
    duration: "required",
    price: "required",
    type: "required"
  });

  let matched = await v.check().then((val) => val);
  if (!matched) {
    return res.status(200).send({
      status: true,
      error: v.errors,
    });
  }

  let subdata = {
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    seller_comission: req.body.seller_comission,
    duration: req.body.duration,
    price: req.body.price,
    type: req.body.type,
    no_of_listing: req.body.no_of_listing
  }
  if (req.body.no_of_listing != "" || req.body.no_of_listing != null || typeof req.body.no_of_listing != "undefined") {
    subdata.no_of_listing = req.body.no_of_listing
  }

  // if(req.query.currency!="CAD"){

  
  //   {
  //     let conVert = await Curvalue.find({from:"CAD",to:req.query.currency}).exec()

  //     console.log("conVert"+req.body.price+ conVert[0].value);
  //     let cal = req.body.price * conVert[0].value
  //   subdata.price = cal.toFixed(2)
  //   }
  // }
  // else{
  //   subdata.price=req.body.price;
  // }

  let subscriptionSchema = new Subsciption(subdata);

  return subscriptionSchema
    .save()
    .then((data) => {
      res.status(200).send({
        status: 200,
        message: "Subscription Added Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: 500,
        message: "Server error. Please try again.",
        error: err,
      });
    });
};

const viewAll = async (req, res) => {
  return Subsciption.aggregate([
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
        error: error,
      });
    });
};

const update = async (req, res) => {
  Subsciption.findOneAndUpdate(
    { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
    req.body,
    { new: true },
    (err, doc) => {
      if (err) {
        res.status(500).json({
          status: false,
          message: "Server error. Please try again.",
          error: err,
        });
      } else if (doc != null) {
        // data = { ...req.body, ...data._doc };
        res.status(200).json({
          status: true,
          message: "Subscription plan update successful",
          data: doc,
        });
      } else {
        res.status(500).json({
          status: false,
          message: "User not match",
          data: null,
        });
      }

      console.log(doc);
    }
  );
};

const Delete = async (req, res) => {
  return Subsciption.remove({
    _id: { $in: [mongoose.Types.ObjectId(req.params.id)] },
  })
    .then((data) => {
      return res.status(200).json({
        status: true,
        message: "Subscription delete successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Server error. Please try again.",
        error: error,
      });
    });
};

const allSubscriptionHistory = async (req, res) => {
  return SubscribedBy.aggregate([
    {
      $project: {
        _v: 0,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "subscr_id",
        foreignField: "_id",
        as: "subscription_data",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userid",
        foreignField: "_id",
        as: "user_data",
      },
    },
  ])
    .then(async data => {
      if (data != null && data != "") {
  
        let newdata=data;
        
        for (let index = 0; index < newdata.length; index++) {
          var element = newdata[index];
    
          if (element.currency !=''&& typeof element.currency!="undefined" && element.currency != "CAD") {


  
  
            let datass =await Curvalue.find({ from:element.currency, to:"CAD"  }).exec()
  
            //console.log(datass);
  
            let resuss = element.price * datass[0].value
  
            newdata[index].price = resuss
          }
        }
            res.status(200).send({
              status: true,
              message: "Subscription History Data Get Successfully",
              data: newdata,
              error: null
             
            });
  
          
        

  
        

      } else {
        res.status(400).send({
          status: false,
          data: null,
          error: "No Data",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        data: null,
        error: err,
        message: "Server Error",
      });
    });
};

const oneSubscriptionHistory = async (req, res) => {
  return SubscribedBy.aggregate([
    {
      $match: {
        userid: mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      $project: {
        _v: 0,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "subscr_id",
        foreignField: "_id",
        as: "subscription_data",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userid",
        foreignField: "_id",
        as: "user_data",
      },
    },
  ])
    .then((data) => {
      if (data != null && data != "") {
        res.status(200).send({
          status: true,
          data: data,
          error: null,
          message: "Subscription History Data Get Successfully",
        });
      } else {
        res.status(400).send({
          status: false,
          data: null,
          error: "No Data",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        data: null,
        error: err,
        message: "Server Error",
      });
    });
};

module.exports = {
  create,
  viewAll,
  update,
  Delete,
  allSubscriptionHistory,
  oneSubscriptionHistory
};
