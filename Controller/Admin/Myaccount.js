var mongoose = require('mongoose');
var Checkout = require('../../Models/checkout');
var Admin = require('../../Models/admin');
var userBookedSlot = require('../../Models/Slot/user_booked_slot');
var sellerSlots = require('../../Models/Slot/seller_slots');
var shopServices = require('../../Models/shop_service');
var Upload = require('../../service/upload');

var passwordHash = require('password-hash');
const { Validator } = require('node-input-validator');

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
          from: "service_carts",//
          localField: "order_id",//
          foreignField: "order_id",
          as: "cart_data"//
        }
      },
      {
        $project: {
          _v: 0
        }
      }
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
    password: "required"
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
      Admin.findOne({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
        .then(user => {
          // if old password value matched & return true from database
          if (user.comparePassword(req.body.old_password) === true) {
            Admin.findOneAndUpdate(
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

module.exports = {
  viewAll,
  cancelBooking,
  updateProfile,
  updatePassword,
  deleteProfile,
  imageurlApi
}