var mongoose = require('mongoose')
var UserBookedSlot = require('../../../Models/Slot/user_booked_slot')
var SellerBookings = require('../../../Models/Slot/seller_bookings')
var SellerTimings = require('../../../Models/Slot/seller_timing')

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

var viewServiceTimingForADay = async (req,res)=>{
    let service_id = req.body.service_id
    SellerTimings.findOne({
        shop_service_id: {$in: [mongoose.Types.ObjectId(service_id)]},
        day_name: req.body.day_name
    })
    .then(data=>{
        res.status(200).json({
            status: true,
            message: "Service times for the day successfully get.",
            data: data
        })
    })
    .catch(err=>{
        res.status(500).json({
            status: false,
            message: "Failed to fetch timings. Server error.",
            error: err
        })
    })
}

var bookAppointment = async (req,res,next)=>{
    const v = new Validator(req.body,{
        day_name: "required",
        duration: "required"
    })

    let matched = v.check().then(val=>val)
    if(!matched){
        return res.status(400).json({ status: false, message: v.errors })
    }

    let saveData1 = {
        _id: mongoose.Types.ObjectId(),
        user_id: req.body.user_id,
        seller_service_id: req.body.seller_service_id,
        seller_timing_id: req.body.seller_timing_id,
        date_of_booking: req.body.date_of_booking,        // send date only in ISO format YYYY-MM-DD
        day_name_of_booking: req.body.day_name_of_booking,
        duration: req.body.duration
    }
    let slotBook = new UserBookedSlot(saveData1)
    
    return slotBook.save()
      .then(data => {
          // console.log('user_booking_data', data);
          let saveData2 = {
            _id: mongoose.Types.ObjectId(),
            seller_service_id: data.seller_service_id,
            user_id: data.user_id,
            user_booking_id: data._id,
            date_of_booking: req.body.date_of_booking,
            date: data.date,
            day_name_of_booking: data.day_name_of_booking,
            duration: data.duration
        }
        console.log('booking_data', saveData2);
        let user_booking_data = new SellerBookings(saveData2)
        user_booking_data.save()
          .then(result => {
            res.status(200).json({
                status: true,
                message: "Service slot booked successfully",
                data: data
            })
          })
          .catch(err => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            })
          })
      })
}

var cancelAppointment = async (req,res)=>{
    // _id of user_booked_slots
    UserBookedSlot.findOneAndUpdate(
        {_id: {$in:[mongoose.Types.ObjectId(req.params.id)]}}, 
        {
            $set: { appointment: "Cancelled" },
        },
        {
            returnNewDocument: true,
        }
    ).then(data => {
        SellerBookings.findOneAndUpdate(
            {user_booking_id: {$in:[mongoose.Types.ObjectId(req.params.id)]}},
            {
                $set: { appointment: "Cancelled" },
            },
            {
                returnNewDocument: true,
            },
            (err,result)=>{
                if(err){
                    res.status(500).json({
                        status: false,
                        message: "Failed to cancel appointment. Server error.",
                        error: err
                    })
                }
                else{
                    res.status(200).json({
                        status: true,
                        message: "Appointment cancelled successfully.",
                        data: data
                    })
                }
            }
        )
    }).catch(fault => {
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: fault
        })
    })
}

// Only used to change date_of_booking and day_name_of_booking
var editAppointment = async (req,res)=>{
    // _id of user_booked_slots
    UserBookedSlot.findByIdAndUpdate(
        {_id: {$in:[mongoose.Types.ObjectId(req.params.id)]}},
        req.body,
        (err,result)=>{}
    )
}

var completeAppointment = async(req,res)=>{
    // _id of user_booked_slots
    UserBookedSlot.findOneAndUpdate(
        {_id: {$in:[mongoose.Types.ObjectId(req.params.id)]}}, 
        {
            $set: { appointment: "Completed" },
        },
        {
            returnNewDocument: true,
        }
    ).then(data => {
        SellerBookings.findOneAndUpdate(
            {user_booking_id: {$in:[mongoose.Types.ObjectId(req.params.id)]}},
            {
                $set: { appointment: "Completed" },
            },
            {
                returnNewDocument: true,
            },
            (err,result)=>{
                if(err){
                    res.status(500).json({
                        status: false,
                        message: "Failed to complete appointment. Server error.",
                        error: err
                    })
                }
                else{
                    res.status(200).json({
                        status: true,
                        message: "Appointment completed successfully.",
                        data: data
                    })
                }
            }
        )
    }).catch(fault => {
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: fault
        })
    })
}

module.exports = {
    checkAvailability,
    viewServiceTimingForADay,
    bookAppointment,
    cancelAppointment,
    editAppointment,
    completeAppointment
}