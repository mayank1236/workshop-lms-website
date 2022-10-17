var mongoose = require("mongoose");
const { Validator } = require("node-input-validator");

var Checkout = require("../../Models/checkout");
var UserBookedSlot = require("../../Models/Slot/user_booked_slot");
var ServiceCart = require("../../Models/service_cart");
var Coupon = require("../../Models/coupon");
var SellerBookings = require("../../Models/Slot/seller_bookings");
var Curvalue = require("../../Models/currvalue");
var moment = require("moment-timezone");

var create = async (req, res) => {
  var alreadyBooked = [];

  for (let i = 0; i < req.body.cart_items.length; i++) {
    let booking_status = await UserBookedSlot.findOne({
      slot_id: mongoose.Types.ObjectId(req.body.cart_items[i].slot_id),
      date_of_booking: req.body.cart_items[i].date_of_booking,
      paid: true,
    }).exec();
    if (booking_status != null) {
      alreadyBooked.push(booking_status);
    }
  }
  console.log("Slots already booked ", alreadyBooked);

  if (alreadyBooked.length > 0) {
    var bookedServices = "";
    for (let i = 0; i < alreadyBooked.length; i++) {
      if (i == 0) {
        bookedServices = bookedServices + alreadyBooked[i].shop_service_name;
      } else {
        bookedServices =
          bookedServices + ", " + alreadyBooked[i].shop_service_name;
      }
    }
    console.log("Booked services are ", bookedServices);

    return res.status(500).json({
      status: false,
      error: `Selected slots for ${bookedServices} has already been booked. Please remove them.`,
      data: null,
    });
  } else {
    const V = new Validator(req.body, {
      user_id: "required",
      // subtotal: "required",
      total: "required",
      firstname: "required",
      lastname: "required",
      address1: "required",
      country: "required",
      state: "required",
      zip: "required",
      // payment_type: "required"
    });
    let matched = V.check().then((val) => val);

    if (!matched) {
      return res.status(400).json({ state: false, error: V.errors });
    }

    let saveData = {
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(req.body.user_id),
      order_id: Number(
        `${new Date().getDate()}${new Date().getHours()}${new Date().getSeconds()}${new Date().getMilliseconds()}`
      ),
      subtotal: req.body.subtotal,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      address1: req.body.address1,
      country: req.body.country,
      state: req.body.state,
      zip: req.body.zip,
      booking_date: moment.tz(Date.now(), "Asia/Kolkata"),
      // payment_type: req.body.payment_type,
    };

    if (req.user.currency != "CAD") {
      let conVert = await Curvalue.find({
        from: req.user.currency,
        to: "CAD",
      }).exec();
      let cal = req.body.subtotal * conVert[0].value;
      saveData.subtotal_cad = cal.toFixed(2);
    } else {
      saveData.subtotal_cad = req.body.subtotal;
    }

    if (
      req.body.discount_percent != "" &&
      req.body.discount_percent != null &&
      typeof req.body.discount_percent != undefined
    ) {
      saveData.discount_percent = req.body.discount_percent;

      var payableAmt =
        req.body.subtotal -
        (req.body.subtotal * req.body.discount_percent) / 100;
      saveData.total = payableAmt;
      if (req.user.currency != "CAD") {
        let conVert = await Curvalue.find({
          from: req.user.currency,
          to: "CAD",
        }).exec();
        let cal = payableAmt * conVert[0].value;
        saveData.price_cad = cal.toFixed(2);
      } else {
        saveData.price_cad = payableAmt;
      }
    } else {
      if (req.user.currency != "CAD") {
        let conVert = await Curvalue.find({
          from: req.user.currency,
          to: "CAD",
        }).exec();
        let cal = req.body.subtotal * conVert[0].value;
        saveData.price_cad = cal.toFixed(2);
      } else {
        saveData.price_cad = req.body.subtotal;
      }
    }
    if (
      req.body.coupon_id != "" &&
      req.body.coupon_id != null &&
      typeof req.body.coupon_id != undefined
    ) {
      saveData.coupon_id = mongoose.Types.ObjectId(req.body.coupon_id);
    }
    if (
      req.body.coupon != "" &&
      req.body.coupon != null &&
      typeof req.body.coupon != undefined
    ) {
      saveData.coupon = req.body.coupon;
    }
    if (
      req.body.email != "" &&
      req.body.email != null &&
      typeof req.body.email != undefined
    ) {
      saveData.email = req.body.email;
    }
    if (
      req.body.address2 != "" &&
      req.body.address2 != null &&
      typeof req.body.address2 != undefined
    ) {
      saveData.address2 = req.body.address2;
    }
    if (
      req.body.payment_type != "" &&
      req.body.payment_type != null &&
      typeof req.body.payment_type != undefined
    ) {
      saveData.payment_type = req.body.payment_type;
    }
    if (
      req.body.card_name != "" &&
      req.body.card_name != null &&
      typeof req.body.card_name != undefined
    ) {
      saveData.card_name = req.body.card_name;
    }
    if (
      req.body.card_no != "" &&
      req.body.card_no != null &&
      typeof req.body.card_no != undefined
    ) {
      saveData.card_no = req.body.card_no;
    }
    if (
      req.body.card_no != "" &&
      req.body.card_no != null &&
      typeof req.body.card_no != undefined
    ) {
      saveData.card_no = req.body.card_no;
    }
    if (
      req.body.exp_date != "" &&
      req.body.exp_date != null &&
      typeof req.body.exp_date != undefined
    ) {
      saveData.exp_date = req.body.exp_date;
    }
    if (
      req.body.cvv != "" &&
      req.body.cvv != null &&
      typeof req.body.cvv != undefined
    ) {
      saveData.cvv = req.body.cvv;
    }
    if (
      req.body.phone != "" &&
      req.body.phone != null &&
      typeof req.body.phone != undefined
    ) {
      saveData.phone = req.body.phone;
    }

    console.log("Checkout data", saveData);

    const checkout = new Checkout(saveData);
    return checkout
      .save()
      .then(async (data) => {
        // Update the cart items with order_id
        ServiceCart.updateMany(
          { user_id: mongoose.Types.ObjectId(req.body.user_id), status: true },
          {
            $set: {
              status: false,
              order_id: data.order_id,
              discount_percent: data.discount_percent,
            },
          },
          (err, writeResult) => {
            if (err) {
              console.log(err.message);
            }
          }
        );

        // Decrease the number of the coupon applied on checkout
        if (data.coupon != null) {
          let coupData = await Coupon.findOne({
            name: data.coupon.name,
            status: true,
          }).exec();

          coupData.times -= 1;
          coupData.save();
        }

        // Update the user bookings with payment status
        UserBookedSlot.updateMany(
          {
            user_id: data.user_id,
            paid: false,
          },
          { $set: { paid: true, order_id: data.order_id, is_booked: false } },
          (fault, result) => {
            if (fault) {
              console.log(fault.message);
            }
          }
        ).exec();

        // Update the seller bookings with payment status
        SellerBookings.updateMany(
          { user_id: data.user_id, new_booking: true, paid: false },
          { $set: { paid: true, order_id: data.order_id } },
          (fault, result) => {
            if (fault) {
              console.log(fault.message);
            }
          }
        ).exec();

        res.status(200).json({
          status: true,
          message: "Service Order Placed Successfully",
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
  }
};

module.exports = {
  create,
};
