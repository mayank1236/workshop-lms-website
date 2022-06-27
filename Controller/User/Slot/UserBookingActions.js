var mongoose = require("mongoose");
const { Validator } = require("node-input-validator");
var moment = require("moment");

var UserBookedSlot = require("../../../Models/Slot/user_booked_slot");
var SellerBookings = require("../../../Models/Slot/seller_bookings");
var SellerTimings = require("../../../Models/Slot/seller_timing");
var ServiceSlots = require("../../../Models/Slot/seller_slots");
var ServiceCart = require("../../../Models/service_cart");

var checkAvailability = async (req, res) => {
  const USER_BOOKINGS = await UserBookedSlot.find({
    seller_service_id: req.body.seller_service_id,
    seller_timing_id: req.body.seller_timing_id,
    date_of_booking: req.body.date_of_booking,
  }).exec();

  console.log("User bookings", USER_BOOKINGS);

  var day_slot_total_time = [];

  USER_BOOKINGS.forEach((element) => {
    day_slot_total_time.push(element.duration);
  });
  //console.log("Duration array", day_slot_total_time)

  // Getting sum of each
  var sum = day_slot_total_time.reduce(function (a, b) {
    return a + b;
  }, 0);
  // console.log(sum);

  const SELLER_TIMING = await SellerTimings.findOne({
    _id: req.body.seller_timing_id,
  }).exec();
  console.log("Seller timing", SELLER_TIMING);
  var total_available_for = SELLER_TIMING.available_duration;
  console.log("Total available for", total_available_for);

  var available_remaining = total_available_for - sum;
  // var date_of_booking = new Date(req.body.date)
  // console.log(date_of_booking)
  // if(USER_BOOKINGS[0].date == date_of_booking){
  //     console.log("True");
  // }
  // else{
  //     console.log("False");
  // }
  if (USER_BOOKINGS == "") {
    return res.status(200).json({
      status: true,
      message: "Any duration slot available",
      slot_durations: SELLER_TIMING.slot_duration,
    });
  } else {
    if (
      available_remaining >= 30 &&
      USER_BOOKINGS[0].date_of_booking == req.body.date_of_booking
    ) {
      res.status(200).json({
        status: true,
        message: "Any duration slot available(1)",
        slot_durations: SELLER_TIMING.slot_duration,
      });
    } else if (
      available_remaining >= 15 &&
      available_remaining < 30 &&
      USER_BOOKINGS[0].date_of_booking == req.body.date_of_booking
    ) {
      res.status(200).json({
        status: true,
        message: "10 or 15 minute slot available",
        slot1: SELLER_TIMING.slot_duration[0],
        slot2: SELLER_TIMING.slot_duration[1],
      });
    } else if (
      available_remaining >= 10 &&
      available_remaining < 15 &&
      USER_BOOKINGS[0].date_of_booking == req.body.date_of_booking
    ) {
      res.status(200).json({
        status: true,
        message: "10 minute slot available only",
        slot: SELLER_TIMING.slot_duration[0],
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Slots not available",
        data: null,
      });
    }
  }
};

var viewSlotsForADay = async (req, res) => {
  var user_id = req.body.user_id;
  var shop_service_id = req.body.shop_service_id;

  // let slots = await ServiceSlots.find({
  //     shop_service_id: { $in: [mongoose.Types.ObjectId(shop_service_id)] },
  //     weekday_name: req.body.weekday_name
  // }).sort({ "timing.from": 1 })

  // let userBookings = await UserBookedSlot.find(
  //     {
  //         date_of_booking: {
  //             $gte: moment.utc(req.body.date).startOf('day').toDate(),
  //             $lte: moment.utc(req.body.date).endOf('day').toDate()
  //         }
  //     }
  // ).exec()
  // console.log("User bookings on date ", userBookings);

  // slots.forEach(element => {
  //     // console.log(element.timing.from)
  //     var Result = userBookings.filter(item => item.from == element.timing.from)
  //     console.log("booking info", Result)
  //     if (Result.length > 0) {
  //         element.booking_info = Result[0]
  //     }
  //     else {
  //         element.booking_info = []
  //     }
  // })
  let slots = await ServiceSlots.aggregate([
    {
      $match: {
        shop_service_id: mongoose.Types.ObjectId(shop_service_id),
        weekday_name: req.body.weekday_name,
      },
    },
    {
      $lookup: {
        from: "user_booked_slots",
        let: {
          // user_id: mongoose.Types.ObjectId(user_id),
          shop_service_id: mongoose.Types.ObjectId(shop_service_id),
          day_name_of_booking: "$weekday_name",
          from: "$timing.from",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // if "paid: true", then slot will be red for user, else green
                  // { $eq: ["$user_id", "$$user_id"] },
                  { $eq: ["$shop_service_id", "$$shop_service_id"] },
                  { $eq: ["$day_name_of_booking", "$$day_name_of_booking"] },
                  { $eq: ["$from", "$$from"] },
                  { $eq: ["$paid", true] },
                  {
                    $gte: [
                      "$date_of_booking",
                      moment.utc(req.body.date).startOf("day").toDate(),
                    ],
                  },
                  {
                    $lte: [
                      "$date_of_booking",
                      moment.utc(req.body.date).endOf("day").toDate(),
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "booking_info",
      },
    },
    { $sort: { "timing.from": 1 } },
  ]).exec();

  if (slots.length < 0) {
    return res.status(200).json({
      status: true,
      message: "Seller doesn't provide service on this day.",
      data: slots,
    });
  } else {
    return res.status(200).json({
      status: true,
      message: "Service times for the day successfully get.",
      data: slots,
    });
  }
};

function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate.getTime());

  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

var viewSlotsAllDay = async (req, res) => {
  var user_id = req.body.user_id;
  var shop_service_id = req.body.shop_service_id;

  const d1 = new Date(req.body.datefrom);
  const d2 = new Date(req.body.dateto);

  let dates = getDatesInRange(d1, d2);
  let event = [];
  for (let index = 0; index < dates.length; index++) {
    const element = dates[index];
    let days = moment(element).format("YYYY-MM-DD");
    let dayname = moment(element, "YYYY-MM-DD").format("dddd");
    //    console.log(dayname);

    let slots = await ServiceSlots.aggregate([
      {
        $match: {
          shop_service_id: mongoose.Types.ObjectId(shop_service_id),
          weekday_name: dayname,
        },
      },
      {
        $lookup: {
          from: "user_booked_slots",
          let: {
            // user_id: mongoose.Types.ObjectId(user_id),
            shop_service_id: mongoose.Types.ObjectId(shop_service_id),
            day_name_of_booking: "$weekday_name",
            from: "$timing.from",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // if "paid: true", then slot will be red for user, else green
                    // { $eq: ["$user_id", "$$user_id"] },
                    { $eq: ["$shop_service_id", "$$shop_service_id"] },
                    { $eq: ["$day_name_of_booking", "$$day_name_of_booking"] },
                    { $eq: ["$from", "$$from"] },
                    { $eq: ["$paid", true] },
                    {
                      $gte: [
                        "$date_of_booking",
                        moment.utc(days).startOf("day").toDate(),
                      ],
                    },
                    {
                      $lte: [
                        "$date_of_booking",
                        moment.utc(days).endOf("day").toDate(),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "booking_info",
        },
      },
      { $sort: { "timing.from": 1 } },
    ]).exec();
    // console.log(days+' '+slots.length);
    if (slots.length == 0) {
      // console.log("1")
      event.push({ "title": "", "date": days, "color": "#FF0000" });
      //   console.log(event)
    } else {
      let booking_infolength = 0;
      let slotlength = slots.length
      slots.forEach((element) => {
        if (element.booking_info.length > 0) {
          booking_infolength = parseInt(booking_infolength) + parseInt(1);
        }
      });
      if (booking_infolength == 0) {
        event.push({ title: "", date: days, color: "#378006" });
      }
      else if(booking_infolength < slotlength)
      {
        event.push({ title: "", date: days, color: "#378006" });
      }
      else {
        event.push({ title: "", date: days, color: "#FF0000" });
      }
    }

  }
  return res.json({
    status:true,
    data:event,
    error :null

  })
};

/** Api for both slot booking and add to cart */
var bookAppointment = async (req, res, next) => {
  // const TODAY = new Date();
  // var now = TODAY.setTime();
  // console.log("This instant ", now);

  // var booking_date_time = req.body.date_of_booking + ' ' + req.body.from;
  // const DATE_OF_BOOKING = new Date(booking_date_time);
  // var bookingMoment = DATE_OF_BOOKING.setTime();
  // console.log("Booking time instant ", bookingMoment);

  // var user_bookings = await UserBookedSlot.findOne({
  //     slot_id: mongoose.Types.ObjectId(req.body.slot_id),
  //     date_of_booking: new Date(req.body.date_of_booking)
  // }).exec()

  var inCart = await ServiceCart.findOne({
    slot_id: mongoose.Types.ObjectId(req.body.slot_id),
    date_of_booking: req.body.date_of_booking,
    status: false,
  }).exec();

  if (inCart != null) {
    return res.status(500).json({
      status: false,
      error: "Slot has already been booked.",
      data: null,
    });
  } else {
    var service_cart = await ServiceCart.find({
      user_id: mongoose.Types.ObjectId(req.body.user_id),
      service_id: mongoose.Types.ObjectId(req.body.shop_service_id),
      status: true,
    }).exec();
    // console.log("User's service cart: ", service_cart);
    // Don't let users who have booked slots but not checked out make new slot booking.
    if (service_cart.length > 0) {
      res.status(500).json({
        status: false,
        message: "Previous service bookings still pending payment.",
        data: service_cart,
      });
    }
 // Otherwise let them.
    else {
    const V = new Validator(req.body, {
      date_of_booking: "required",
      day_name_of_booking: "required",
      from: "required",
      to: "required",
      duration: "required",
    });
    let matched = V.check().then((val) => val);

    if (!matched) {
      res.status(400).json({ status: false, error: V.errors });
    }

    function getTimeAsNumberOfMinutes(time)
    {
        var timeParts = time.split(":");
    
        var timeInMinutes = (timeParts[0] * 60) + timeParts[1];
    
        return timeInMinutes;
    }

    var convertedStartTime = moment(req.body.from, 'hh:mm A').format('HH:mm')
    // console.log(convertedStartTime);


    var convertedEndTime = moment(req.body.to, 'hh:mm A').format('HH:mm')
    // console.log(convertedEndTime);

    var slotBookTime = await UserBookedSlot.find({
      date_of_booking: req.body.date_of_booking,
    }).exec();

    var checkslot=false;
    for (let i = 0; i < slotBookTime.length; i++) {

      var slotStartTime = moment(slotBookTime[i].from, 'hh:mm A').format('HH:mm')
      // console.log(slotStartTime);


      var slotEndTime = moment(slotBookTime[i].to, 'hh:mm A').format('HH:mm')
      // console.log(slotEndTime);
      // console.log("completed" + i);
      
      if ((getTimeAsNumberOfMinutes(slotStartTime) <
        getTimeAsNumberOfMinutes(convertedStartTime) && getTimeAsNumberOfMinutes(convertedStartTime) <
        getTimeAsNumberOfMinutes(slotEndTime)) ||
        (getTimeAsNumberOfMinutes(slotStartTime) <
          getTimeAsNumberOfMinutes(convertedEndTime) && getTimeAsNumberOfMinutes(convertedEndTime) <
          getTimeAsNumberOfMinutes(slotEndTime))) {
            checkslot=true;
           break;
     
      }
   


    }

    if (checkslot) {
        return res.status(500).json({
          status: false,
          error: "Slot time has already been booked.",
          data: slotBookTime,
        });
    }
    // else{
    //   console.log("available");
    // }
    else {
      let saveData1 = {
        _id: mongoose.Types.ObjectId(),
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        slot_id: mongoose.Types.ObjectId(req.body.slot_id),
        shop_service_id: mongoose.Types.ObjectId(req.body.shop_service_id),
        seller_id: mongoose.Types.ObjectId(req.body.seller_id),
        date_of_booking: req.body.date_of_booking,
        day_name_of_booking: req.body.day_name_of_booking,
        from: req.body.from,
        to: req.body.to,
        duration: req.body.duration,
      };
      if (
        req.body.shop_service_name != "" &&
        req.body.shop_service_name != null &&
        typeof req.body.shop_service_name != "undefined"
      ) {
        saveData1.shop_service_name = req.body.shop_service_name;
      }   
      if (
        req.body.price != "" &&
        req.body.price != null &&
        typeof req.body.price != "undefined"
      ) {
        saveData1.price = req.body.price;
      }
      if (
        req.body.image == "" ||
        req.body.image == null ||
        typeof req.body.image == "undefined"
      ) {
        saveData1.image = null;
      } else {
        saveData1.image = req.body.image;
      }

      const USER_BOOKED_SLOT = new UserBookedSlot(saveData1);

      USER_BOOKED_SLOT.save(async (err, docs) => {
        if (!err) {
          console.log("User booking info: ", docs);

          let sellerBookingData = {
            _id: mongoose.Types.ObjectId(),
            user_booking_id: docs._id,
            user_id: docs.user_id,
            slot_id: docs.slot_id,
            shop_service_id: docs.shop_service_id,
            seller_id: docs.seller_id,
            date_of_booking: docs.date_of_booking,
            day_name_of_booking: docs.day_name_of_booking,
            from: docs.from,
            to: docs.to,
            duration: docs.duration,
          };

          let cartData = {
            _id: mongoose.Types.ObjectId(),
            user_id: docs.user_id,
            user_booking_id: docs._id,
            seller_id: docs.seller_id,
            service_id: docs.shop_service_id,
            slot_id: docs.slot_id,
            service_name: docs.shop_service_name,
            price: docs.price,
            date_of_booking: docs.date_of_booking,
            // currency:req.body.currency
            currency: req.body.currency,
          };
        
          if (
            docs.image == "" ||
            docs.image == null ||
            typeof docs.image == "undefined"
          ) {
            cartData.image = null;
          } else {
            cartData.image = docs.image;
          }

          const SELLER_BOOKING = new SellerBookings(sellerBookingData);
          const SERVICE_CART = new ServiceCart(cartData);

          var saveInSellerBookings = await SELLER_BOOKING.save();

          SERVICE_CART.save()
            .then((data2) => {
      

              res.status(200).json({
                status: true,
                message:
                  "Slot booking successfull. Awaiting seller confirmation.",
                data: docs,
              });
            })
            .catch((fault) => {
              res.status(500).json({
                status: false,
                message: "Couldn't book slot. Server error",
                error: fault.message,
              });
            });
        } else {
          res.send({
            status: false,
            msg: "Server error. Please try again",
            error: err.message,
          });
        }
      });
    }
    }
  }
};

module.exports = {
  checkAvailability,
  viewSlotsForADay,
  bookAppointment,
  viewSlotsAllDay,
};
