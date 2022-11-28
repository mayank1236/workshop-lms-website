var mongoose = require("mongoose");
const { Validator } = require("node-input-validator");

var ServiceCart = require("../../Models/service_cart");
var sellerSlot = require("../../Models/Slot/seller_slots");
var userBookedSlot = require("../../Models/Slot/user_booked_slot");

var getServiceCart = async (req, res) => {
  return ServiceCart.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(req.params.user_id),
        status: true,
      },
    },
    {
      $lookup: {
        from: "seller_slots",
        localField: "slot_id",
        foreignField: "_id",
        as: "SlotData",
      },
    },
    {
      $unwind:"$SlotData"
    },
    
    {
      $lookup: {
        from: "users",
        localField: "seller_id",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              __v: 0,
              password: 0,
              token: 0,
            },
          },
        ],
        as: "seller_data",
      },
    },
    {
      $lookup: {
        from: "coupons",
        localField: "coupon",
        foreignField: "name",
        as: "coupon_data",
      },
    },
    { $project: { _v: 0 } },
  ])
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json({
          status: true,
          message: "Service cart listing successfully get",
          data: data,
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Empty ServiceCart",
          data: data,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "No Match",
        data: null,
      });
    });
};

var DeleteCart = async (req, res) => {
  return ServiceCart.findOneAndDelete({
    _id: { $in: [mongoose.Types.ObjectId(req.params.id)] },
  })
    .then((data) => {
      console.log(data);
      sellerSlot
        .findOneAndUpdate(
          { _id: { $in: [data.slot_id] } },
          { $set: { booking_status: false } },
          { returnNewDocument: true },
          (fault, result) => {
            if (!fault) {
              userBookedSlot.findOneAndUpdate(
                {
                  user_id: data.user_id,
                  slot_id: data.slot_id,
                  shop_service_id: data.service_id,
                  seller_id: data.seller_id,
                  is_booked: true,
                },
                {
                  $set: { is_booked: false },
                },
                {
                  returnNewDocument: true,
                },
                (err2, writeResult) => {
                  if (!err2) {
                    res.status(200).json({
                      status: true,
                      message: "Cart item deleted successfully.",
                      data: data,
                    });
                  } else {
                    res.status(500).json({
                      status: false,
                      message:
                        "Server error2 - Couldn't update seller slot and delete from cart",
                      data: null,
                    });
                  }
                }
              );
            } else {
              res.status(500).json({
                status: false,
                message:
                  "Server error1 - Couldn't update seller slot and delete from cart",
                data: null,
              });
            }
          }
        )
        .exec();
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Server error. Please try again.",
        error: err,
      });
    });
};

var DeleteCartNew = async (req, res) => {
  return ServiceCart.findOneAndDelete({
    _id: { $in: [mongoose.Types.ObjectId(req.params.id)] },
  })
    .then((data) => {
      console.log(data);
      // sellerSlot.findOneAndDelete({ _id: { $in: [data.slot_id] } })
      //   .then((fault) => {
      userBookedSlot
        .findOneAndDelete({
          user_id: mongoose.Types.ObjectId(data.user_id),
          slot_id: mongoose.Types.ObjectId(data.slot_id),
          shop_service_id: mongoose.Types.ObjectId(data.service_id),
          seller_id: mongoose.Types.ObjectId(data.seller_id),
          is_booked: true,
        })
        .then((result) => {
          res.status(200).json({
            status: true,
            message: "Cart item deleted successfully.",
            data: result,
          });
        })
        .catch(() => {
          res.status(500).json({
            status: false,
            message:
              "Server error2 - Couldn't update seller slot and delete from cart",
            data: null,
          });
        });

      // }).catch((error) => {
      //   res.status(500).json({
      //     status: false,
      //     message: "Server error1 - Couldn't update seller slot and delete from cart",
      //     data: error
      //   })
      // })
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        message: "Server error. Please try again.",
        error: err,
      });
    });
};

module.exports = {
  getServiceCart,
  DeleteCart,
  DeleteCartNew,
};
