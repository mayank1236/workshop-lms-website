var mongoose = require('mongoose')
var UserBookedSlot = require('../../../Models/Slot/user_booked_slot')
var SellerBookings = require('../../../Models/Slot/seller_bookings')
var SellerTimings = require('../../../Models/Slot/seller_timing')
var ServiceSlots = require('../../../Models/Slot/seller_slots')
var ServiceCart = require('../../../Models/service_cart')

const { Validator } = require('node-input-validator')

var checkAvailability = async (req,res)=>{
    const USER_BOOKINGS = await UserBookedSlot.find(
        {
            seller_service_id: req.body.seller_service_id,
            seller_timing_id: req.body.seller_timing_id,
            date_of_booking: req.body.date_of_booking
        }).exec()

    console.log("User bookings", USER_BOOKINGS);
    
    var day_slot_total_time = []
    
    USER_BOOKINGS.forEach(element => {
        day_slot_total_time.push(element.duration)
    });
    //console.log("Duration array", day_slot_total_time)
    
    // Getting sum of each
    var sum = day_slot_total_time.reduce(function(a, b){
        return a + b;
    }, 0);
    // console.log(sum);

    const SELLER_TIMING = await SellerTimings.findOne({_id: req.body.seller_timing_id}).exec()
    console.log("Seller timing", SELLER_TIMING);
    var total_available_for = SELLER_TIMING.available_duration
    console.log("Total available for", total_available_for);
    
    var available_remaining = total_available_for - sum
    // var date_of_booking = new Date(req.body.date) 
    // console.log(date_of_booking)
    // if(USER_BOOKINGS[0].date == date_of_booking){
    //     console.log("True");
    // }
    // else{
    //     console.log("False");
    // }
    if(USER_BOOKINGS=='') {
        return res.status(200).json({
            status: true,
            message: "Any duration slot available",
            slot_durations: SELLER_TIMING.slot_duration
        })
    }
    else {
        if(available_remaining>=30 && USER_BOOKINGS[0].date_of_booking==req.body.date_of_booking) {
            res.status(200).json({
                status: true,
                message: "Any duration slot available(1)",
                slot_durations: SELLER_TIMING.slot_duration
            })
        }
        else if(available_remaining>=15 && available_remaining<30 && USER_BOOKINGS[0].date_of_booking==req.body.date_of_booking){
            res.status(200).json({
                status: true,
                message: "10 or 15 minute slot available",
                slot1: SELLER_TIMING.slot_duration[0],
                slot2: SELLER_TIMING.slot_duration[1]
            })
        }
        else if(available_remaining>=10 && available_remaining<15 && USER_BOOKINGS[0].date_of_booking==req.body.date_of_booking){
            res.status(200).json({
                status: true,
                message: "10 minute slot available only",
                slot: SELLER_TIMING.slot_duration[0]
            })
        }
        else {
            res.status(200).json({
                status: true,
                message: "Slots not available",
                data: null
            })
        }
    }
}

var viewSlotsForADay = async (req,res)=>{
    let shop_service_id = req.body.shop_service_id
    ServiceSlots.find({
        shop_service_id: {$in: [mongoose.Types.ObjectId(shop_service_id)]},
        weekday_name: req.body.weekday_name
    })
    .then(data=>{
        if (data==null || data=='') {
            res.status(200).json({
                status: true,
                message: "Seller doesn't provide service on this day.",
                data: []
            })
        }
        else {
            res.status(200).json({
                status: true,
                message: "Service times for the day successfully get.",
                data: data
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            status: false,
            message: "Failed to fetch timings. Server error.",
            error: err
        })
    })
}

/** Api for both slot booking and add to cart */
var bookAppointment = async (req,res,next)=>{
    const V = new Validator(req.body, {
        day_name_of_booking: "required",
        from: "required",
        to: "required",
        duration: "required"
    })
    let matched = V.check().then(val=>val)
    
    if (!matched) {
        res.status(500).json({ status: false, error: V.errors })
    }
    
    let saveData1 = {
        _id: mongoose.Types.ObjectId(),
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        slot_id: mongoose.Types.ObjectId(req.body.slot_id),
        shop_service_id: mongoose.Types.ObjectId(req.body.shop_service_id),
        seller_id: mongoose.Types.ObjectId(req.body.seller_id),
        day_name_of_booking: req.body.day_name_of_booking,
        from: req.body.from,
        to: req.body.to,
        duration: req.body.duration
    }
    if (
        req.body.shop_service_name!="" && 
        req.body.shop_service_name!=null && 
        typeof req.body.shop_service_name!="undefined"
        ) {
        saveData1.shop_service_name = req.body.shop_service_name
    }
    if (
        req.body.price!="" && 
        req.body.price!=null && 
        typeof req.body.price!="undefined"
        ) {
        saveData1.price = req.body.price
    }
    if (
        req.body.image!="" && 
        req.body.image!=null && 
        typeof req.body.image!="undefined"
        ) {
        saveData1.image = req.body.image
    }
    
    const USER_BOOKED_SLOT = new UserBookedSlot(saveData1);
    
    USER_BOOKED_SLOT.save(async (err,docs)=>{
        if (!err) {
            console.log("User booking info: ", docs)
            var service_cart = await ServiceCart.find({
                user_id: docs.user_id,
                service_id: docs.shop_service_id,
                status: true
            }).exec()
            console.log("User's service cart: ", service_cart)

            if (service_cart.length>0) {
                res.status(500).json({
                    status: false,
                    message: "Slot has already been booked for this request.",
                    data: service_cart
                })
            }
            else {
                let sellerBookingData = {
                    _id: mongoose.Types.ObjectId(),
                    user_booking_id: docs._id,
                    user_id: docs.user_id,
                    slot_id: docs.slot_id,
                    shop_service_id: docs.shop_service_id,
                    seller_id: docs.seller_id,
                    day_name_of_booking: docs.day_name_of_booking,
                    from: docs.from,
                    to: docs.to,
                    duration: docs.duration
                }

                let cartData = {
                    _id: mongoose.Types.ObjectId(),
                    user_id: docs.user_id,
                    user_booking_id: docs._id,
                    seller_id: docs.seller_id,
                    service_id: docs.shop_service_id,
                    slot_id: docs.slot_id,
                    service_name: docs.shop_service_name,
                    price: docs.price,
                    image: docs.image
                }

                const SELLER_BOOKING = new SellerBookings(sellerBookingData)
                const SERVICE_CART = new ServiceCart(cartData)

                var saveInSellerBookings = await SELLER_BOOKING.save()

                SERVICE_CART.save()
                  .then(data2=>{
                      var updateSlotBookingStatus = ServiceSlots.findOneAndUpdate(
                          {
                              _id: {$in: [mongoose.Types.ObjectId(req.body.slot_id)]},
                              // weekday_name: req.body.day_name_of_booking
                          },
                          { $set: { booking_status: true } },
                          { returnNewDocument: true }
                      ).exec()
                      
                      res.status(200).json({
                          status: true,
                          message: "Slot booking successfull. Awaiting seller confirmation.",
                          data: docs
                        })
                  })
                  .catch(fault=>{
                      res.status(500).json({
                          status: false,
                          message: "Couldn't book slot. Server error",
                          error: fault
                        })
                  })
            }
        }
        else {
            res.send({
                status: false,
                msg: "Server error. Please try again",
                error: err
            })
        }
    })
}

module.exports = {
    checkAvailability,
    viewSlotsForADay,
    bookAppointment,
}