var mongoose = require('mongoose');
var passwordHash = require('password-hash');
const { Validator } = require('node-input-validator');

var Checkout = require('../../Models/checkout');
var User = require('../../Models/user');
var userBookedSlot = require('../../Models/Slot/user_booked_slot');
var sellerSlots = require('../../Models/Slot/seller_slots');
var shopServices = require('../../Models/shop_service');
var Upload = require('../../service/upload');
var ServiceCart = require('../../Models/service_cart');
var ServiceRefund = require('../../Models/service_refund');
// var ServiceSaleEarning = require('../../Models/earnings/service_sale_earnings');

var viewAll = async (req, res) => {
  return Checkout.aggregate(
    [
      {
        $match: {
          user_id: mongoose.Types.ObjectId(req.params.user_id),
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_data"
        }
      },
      {
        $unwind: {
          path: "$user_data",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "service_carts",//
          localField: "order_id",//
          foreignField: "order_id",
          as: "cart_data"//
        }
      },
      {
        $unwind: {
          path: "$cart_data",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "user_booked_slots",
          let: { user_booking_id: "$cart_data.user_booking_id" },
          pipeline: [{ $match: { $expr: { $and: [{ $eq: ["$_id", "$$user_booking_id"] }] } } }],
          as: "cart_data.slot_data"
        }
      },
      {
        $unwind: {
          path: "$cart_data.slot_data",
          preserveNullAndEmptyArrays: true
        }
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     let: {seller_id: "$cart_data.seller_id"},
      //     pipeline: [{$match: {$expr: {$and: [{$eq: ["$_id", "$$seller_id"]}]}}}],
      //     as: "cart_data.seller_data"
      //   }
      // },
      // {
      //   $unwind: {
      //     path: "$cart_data.seller_data",
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
      // {
      //   $lookup: {
      //     from: "shop_services",
      //     let: {service_id: "$cart_data.service_id"},
      //     pipeline: [{$match: {$expr: {$and: [{$eq: ["$_id", "$$service_id"]}]}}}],
      //     as: "cart_data.seller_data.service_data"
      //   }
      // },
      // {
      //   $lookup: {
      //     from: "service_refunds",
      //     localField: "order_id",
      //     foreignField: "order_id",
      //     as: "service_refund"
      //   }
      // },
      // {
      //   $unwind: {
      //     path: "$service_refund",
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
      {
        $project: {
          _id: 0
        }
      },
      {
        $group: {
          _id: "$order_id",
          order_subtotal: { $sum: "$cart_data.price" },
          discount: { $sum: "$cart_data.discount_percent" },
          user_data: { $push: "$user_data" },
          cart_data: { $push: "$cart_data" }
        }
      },
      {
        $sort: {
          booking_date: -1
        }
      },
      // { $sort: { _id: -1 } }
    ]
  )
    .then((docs) => {
      res.status(200).json({
        status: true,
        message: "Order History get successfully",
        data: docs
      })
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Server error. Please try again.",
        error: err
      })
    })
}

var cancelOrder = async (req, res) => {
  return Checkout.findOneAndUpdate(

    { _id: mongoose.Types.ObjectId(req.params.id) },
    { $set: { order_status: 'cancelled' } },
    { new: true },
    (err, data) => {
      console.log(data);
      if (!err) {
        res.status(200).json({
          status: true,
          message: "Ordered cancelled successfully.",
          data: data
        })
      }
      else {

        res.status(400).json({
          status: true,
          message: "Failed to cancel order. Server error.",
          data: err
        })
      }
    }
  )



}

var cancelBooking = async (req, res) => {
  return Checkout.findOneAndUpdate(
    { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
    { $set: { status: 'cancel' } },
    { returnNewDocument: true },
    (err, docs) => {
      if (!err) {
        userBookedSlot.findOne({ _id: { $in: docs.user_booking_id } })
          .then(data => {
            console.log("User booking data", data);
            var sellerSlotData = sellerSlots.findOneAndUpdate(
              { _id: { $in: data.slot_id } },
              { $set: { booking_status: false } },
              { returnNewDocument: true }
            ).exec();

            res.status(200).json({
              status: true,
              message: "Booking cancelled. Amount will be refunded.",
              data: docs
            })
          })
          .catch(fault => {
            res.status(500).json({
              status: false,
              message: "Failed to free the seller slot. Slot still booked.",
              error: fault
            })
          })
      }
      else {
        res.status(500).json({
          status: false,
          message: "Failed to cancel booking. Server error.",
          error: err
        })
      }
    }
  )
}

var updateProfile = async (req, res) => {
  const V = new Validator(req.body, {
    // email, password should be made unable for edit in frontend
    firstName: "required",
    lastName: "required",
    email: "required|email",
    password: "required",
    mobile_code: "required"
  });
  let matched = V.check().then(val => val);
  if (!matched) {
    return res.status(400).json({ status: false, error: V.errors });
  }

  // let editData = {
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     email: req.body.email,
  //     password: req.body.password,
  //     about: req.body.about,
  // }

  // if (req.body.include == "" ||
  //     req.body.include == null ||
  //     typeof req.body.include == "undefined") {
  //     editData.include = null
  // } else {
  //     editData.include = JSON.parse(req.body.include)
  // }


  // console.log(req.file);
  // if (req.file != null &&
  //     req.file != "" &&
  //     typeof req.file != "undefined") {
  //     let image_url = await Upload.uploadFile(req, "profile_pics");
  //     editData.image = image_url;
  // }

  var profile = await User.findOne(
    { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } }
  ).exec();

  if (profile != null || profile != "") {
    User.findOneAndUpdate(
      { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
      req.body,
      { new: true },
      (err, docs) => {
        if (!err) {
          res.status(200).json({
            status: true,
            message: "Profile successfully updated.",
            data: docs
          });
        }
        else {
          res.status(500).json({
            status: false,
            message: "Failed to update profile. Server error.",
            error: err
          });
        }
      }
    )
  }
  else {
    return res.status(500).json({
      status: false,
      message: "Profile details not found. Server error.",
      data: profile
    });
  }
}

var updatePassword = async (req, res) => {
  const V = new Validator(req.body, {
    old_password: 'required',
    new_password: 'required',// |minLength:8
    cnf_password: 'required' // |minLength:8
  });
  let matched = V.check().then(val => val);

  if (!matched) {
    return res.status(400).json({
      status: false,
      errors: V.errors
    });
  }
  // if new password and confirm password is same
  if (req.body.cnf_password == req.body.new_password) {
    // if new pw and old pw is same
    if (req.body.new_password == req.body.old_password) {
      return res.status(500).json({
        status: false,
        message: "New and old password is same",
        data: null
      });
    }
    // if new and old password is not same, then update
    else {
      User.findOne({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
        .then(user => {
          // if old password value matched & return true from database
          if (user.comparePassword(req.body.old_password) === true) {
            User.findOneAndUpdate(
              { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
              { password: passwordHash.generate(req.body.new_password) },
              { returnDocument: true },
              (fault, docs) => {
                if (!fault) {
                  res.status(200).json({
                    status: true,
                    message: "Password updated successfully",
                    data: docs
                  });
                }
                else {
                  res.status(500).json({
                    status: false,
                    message: "Failed to update password.Server error.",
                    error: fault
                  });
                }
              }
            )
          }
          // if old password value is incorrectly provided
          else {
            res.status(500).json({
              status: false,
              message: "Old password is incorrect.",
              data: null
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            status: false,
            message: "No profile details found. Server error.",
            error: err
          });
        })
    }
  }
  // if new and confirm pw does not match
  else {
    return res.status(400).json({
      status: false,
      message: "Confirmed password doesn't match with new password",
      data: null
    });
  }
}

var deleteProfile = async (req, res) => {
  var id = req.params.id;

  var profile = await User.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();

  if (profile.type == "User") {
    return User.findOneAndDelete(
      { _id: mongoose.Types.ObjectId(id) },
      (err, docs) => {
        if (!err) {
          res.status(200).json({
            status: true,
            message: "Profile deleted successfully.",
            data: docs
          });
        }
        else {
          res.status(500).json({
            status: false,
            message: "Invalid id1.",
            error: err
          });
        }
      }
    );
  }
  else {
    return User.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) })
      .then(data => {
        shopServices.updateMany(
          { user_id: mongoose.Types.ObjectId(data._id) },
          { $set: { status: false } },
          { multi: true },
          (fault, docs) => {
            console.log(fault);
          }
        );

        res.status(200).json({
          status: true,
          message: "Profile deleted successfully. Related shop services deactivated.",
          data: docs
        });
      })
      .catch(err => {
        res.status(500).json({
          status: false,
          message: "Invalid id2.",
          error: err
        });
      })
  }
}

// Api to return the destination of image uploaded
var imageurlApi = async (req, res) => {
  let imagUrl = '';
  let image_url = await Upload.uploadFile(req, "profile_images")
  if (typeof (req.file) != 'undefined' || req.file != '' || req.file != null) {
    imagUrl = image_url
  }

  return User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    { profile: imagUrl },    // 'profile' is attribute name for profile image in collection
    { new: true },
    (err, docs) => {
      if (!err) {
        res.status(200).json({
          status: true,
          data: imagUrl,
          error: null
        });
      }
      else {
        res.status(500).json({
          status: false,
          message: "Invalid id. Couldn't upload file.",
          error: err
        });
      }
    }
  );
}

var serviceRefund = async (req, res) => {
  var id = req.params.id;  // cart _id

  let cartData = await ServiceCart.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();

  console.log("Order id ", cartData.order_id);

  if (cartData.order_id == null || cartData.order_id == "" || typeof cartData.order_id == "undefined") {
    return res.status(500).json({
      status: false,
      error: "Invalid id. Payment not made for this order.",
      data: null
    });
  }
  else {
    return ServiceCart.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { $set: { refund_request: "Yes" } },
      { new: true }
    )
      .then(async (docs) => {
        console.log("Cart ", docs);
        var refAmt = 0;   // this will go to 'refund_amount'
        if (docs.discount_percent == null || docs.discount_percent == "" || typeof docs.discount_percent == "undefined") {
          refAmt = parseInt(docs.price);
        }
        else {
          refAmt = parseInt(docs.price) - ((parseInt(docs.price) * parseInt(docs.discount_percent)) / 100);
        }

        let checkoutData = await Checkout.findOne({ order_id: docs.order_id }).exec();
        console.log("Checkout ", checkoutData);

        let refundSaveData = {
          user_id: docs.user_id,
          seller_id: docs.seller_id,
          serv_id: docs.service_id,
          cart_id: docs._id,
          order_id: docs.order_id,
          refund_amount: refAmt,
          firstname: checkoutData.firstname,
          lastname: checkoutData.lastname,
          address1: checkoutData.address1,
          country: checkoutData.country,
          state: checkoutData.state,
          zip: checkoutData.zip,
          paymenttype: checkoutData.payment_type
        }
        if (checkoutData.address2 != "" || checkoutData.address2 != null || typeof checkoutData.address2 != "undefined") {
          refundSaveData.address2 = checkoutData.address2;
        }
        if (checkoutData.card_name != "" || checkoutData.card_name != null || typeof checkoutData.card_name != "undefined") {
          refundSaveData.cardname = checkoutData.card_name;
        }
        if (checkoutData.card_no != "" || checkoutData.card_no != null || typeof checkoutData.card_no != "undefined") {
          refundSaveData.cardno = checkoutData.card_no;
        }
        if (checkoutData.exp_date != "" || checkoutData.exp_date != null || typeof checkoutData.exp_date != "undefined") {
          refundSaveData.expdate = checkoutData.exp_date;
        }
        if (checkoutData.cvv != "" || checkoutData.cvv != null || typeof checkoutData.cvv != "undefined") {
          refundSaveData.cvv = checkoutData.cvv;
        }

        const NEW_REFUND = new ServiceRefund(refundSaveData);
        let saveRefund = await NEW_REFUND.save();
        console.log("Refund data", saveRefund);

        res.status(200).json({
          status: true,
          message: "Refund request successful.",
          data: docs
        });
      })
      .catch(err => {
        res.status(500).json({
          status: false,
          message: "Invalid id. Server error.",
          error: err.message
        });
      });
  }
}

module.exports = {
  viewAll,
  cancelBooking,
  updateProfile,
  updatePassword,
  deleteProfile,
  imageurlApi,
  serviceRefund,
  cancelOrder
}