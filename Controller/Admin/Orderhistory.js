var mongoose = require("mongoose");
var Checkout = require("../../Models/checkout");
var Cart = require("../../Models/service_cart");

const Curvalue = require("../../Models/currvalue");

var viewAll = async (req, res) => {
  return Checkout.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
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
        as: "user_data",
      },
    },
    {
      $unwind: {
        path: "$user_data",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "service_carts",
        localField: "order_id",
        foreignField: "order_id",
        pipeline: [
          {
            $lookup: {
              from: "user_booked_slots",
              localField: "user_booking_id",
              foreignField: "_id",
              as: "booked_slot_data",
            },
          },
          {
            $lookup: {
              from: "admincommissions",
              localField: "order_id",
              foreignField: "order_id",
              as: "admin_data",
            },
          },
          {
            $lookup: {
              from: "shop_services",
              localField: "user_id",
              foreignField: "user_id",
              as: "category_data",
            },
          },
        ],
        as: "cart_data",
      },
    },

    { $project: { _id: 0 } },

    { $sort: { booking_date: -1 } },
  ])
    .then(async (data) => {
      // console.log(data[0].cart_data[0].currency);

      for (let index = 0; index < data.length; index++) {
        var element = data[index];

        if (element.cart_data[0].currency != "CAD") {
          // console.log(element.cart_data[0].currency);

          let datass = await Curvalue.find({
            from: element.cart_data[0].currency,
            to: "CAD",
          }).exec();

          // console.log(datass);

          let resuss = element.order_subtotal * datass[0].value;

          data[index].order_subtotal = resuss;
        }
      }

      res.status(200).json({
        status: true,
        message: "Order History found successfully",
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

var viewDataPerorder = async (req, res) => {
  console.log(req.params.orderid);
  return Cart.aggregate([
    {
      $match: {
        order_id: Number(req.params.orderid),
      },
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
        as: "provider_data",
      },
    },
    {
      $unwind: {
        path: "$provider_data",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
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
        as: "user_data",
      },
    },
    {
      $unwind: {
        path: "$user_data",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "user_booked_slots",
        localField: "user_booking_id",
        foreignField: "_id",
        as: "booked_slot_data",
      },
    },

    { $sort: { booking_date: -1 } },
  ])
    .then(async (data) => {
      res.status(200).json({
        status: true,
        message: "Order History found successfully",
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

module.exports = {
  viewAll,
  viewDataPerorder,
};
