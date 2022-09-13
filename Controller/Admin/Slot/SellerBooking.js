var mongoose = require("mongoose");

var sellerBookings = require("../../../Models/Slot/seller_bookings");

var newBookings = async (req, res) => {
  var new_bookings = await sellerBookings
    .aggregate([
      {
        $match: {
          new_booking: true,
          booking_accept: false,
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
                token: 0
              }
            }
          ],
          as: "user_data",
        },
      },
      {
        $lookup: {
          from: "shop_services",
          localField: "shop_service_id",
          foreignField: "_id",
          as: "shopservice_data",
        },
      },
      {
        $lookup: {
          from: "service_carts",
          localField: "cart_id",
          foreignField: "_id",
          as: "cart_data",
        },
      },
      {
        $lookup: {
          from: "checkouts",
          localField: "order_id",
          foreignField: "order_id",
          as: "order_data",
        },
      },

      {
        $sort: {
          "order_data.booking_date": -1
        }
      },
      {
        $project: {
          __v: 0,
        },
      },
    ])
    .exec();

  if (new_bookings.length > 0) {
    return res.status(200).json({
      status: true,
      message: "New bookings successfully get.",
      data: new_bookings,
    });
  } else {
    res.status(200).json({
      status: true,
      message: "No new bookings",
      data: new_bookings,
    });
  }
};

var viewAcceptedBookings = async (req, res) => {
  var accepted_bookings = await sellerBookings
    .aggregate([
      {
        $match: {
          new_booking: false,
          booking_accept: true,
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
                token: 0
              }
            }
          ],
          as: "user_data",
        },
      },
      {
        $lookup: {
          from: "shop_services",
          localField: "shop_service_id",
          foreignField: "_id",
          as: "shopservice_data",
        },
      },

      {
        $lookup: {
          from: "service_carts",
          localField: "cart_id",
          foreignField: "_id",
          as: "cart_data",
        },
      },
      {
        $lookup: {
          from: "checkouts",
          localField: "order_id",
          foreignField: "order_id",
          as: "order_data",
        },
      },

      {
        $sort: {
          "order_data.booking_date": -1
        }
      },
      {
        $project: {
          __v: 0,
        },
      },
    ])
    .exec();

  if (accepted_bookings.length > 0) {
    return res.status(200).json({
      status: true,
      message: "All accepted bookings successfully get.",
      data: accepted_bookings,
    });
  } else {
    return res.status(200).json({
      status: true,
      message: "No bookings accepted till date.",
      data: accepted_bookings,
    });
  }
};

var viewRejectedBookings = async (req, res) => {
  var accepted_bookings = await sellerBookings
    .aggregate([
      {
        $match: {
          //seller_id: mongoose.Types.ObjectId(req.params.seller_id),
          new_booking: false,
          booking_accept: false,
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
                token: 0
              }
            }
          ],
          as: "user_data",
        },
      },
      {
        $lookup: {
          from: "shop_services",
          localField: "shop_service_id",
          foreignField: "_id",
          as: "shopservice_data",
        },
      },
      {
        $lookup: {
          from: "service_carts",
          localField: "cart_id",
          foreignField: "_id",
          as: "cart_data",
        },
      },
      {
        $lookup: {
          from: "checkouts",
          localField: "order_id",
          foreignField: "order_id",
          as: "order_data",
        },
      },

      {
        $sort: {
          "order_data.booking_date": -1
        }
      },
      {
        $project: {
          __v: 0,
        },
      },
    ])
    .exec();

  if (accepted_bookings.length > 0) {
    return res.status(200).json({
      status: true,
      message: "All rejected bookings successfully get.",
      data: accepted_bookings,
    });
  } else {
    return res.status(200).json({
      status: true,
      message: "No bookings rejected till date.",
      data: accepted_bookings,
    });
  }
};

module.exports = {
  newBookings,
  viewAcceptedBookings,
  viewRejectedBookings,
};
