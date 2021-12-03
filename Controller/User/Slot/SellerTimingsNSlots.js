var mongoose = require('mongoose')
var sellerTimings = require('../../../Models/Slot/seller_timing')
var sellerSlots = require('../../../Models/Slot/seller_slots')

const { Validator } = require('node-input-validator')
// const { find } = require('../../../Models/Slot/seller_timing')

var createTimingNSlots = async (req, res, next) => {
    var selectDays = []
    console.log("Selected days", selectDays)

    req.body.day_name.forEach(element => {
        console.log(element.value)
        selectDays.push(element.value.toString());
        sellerTimings.findOne({
            shop_service_id: { $in: [mongoose.Types.ObjectId(req.body.shop_service_id)] },
            day_name: element.value
        })
            .then(result => {
                // console.log(result);
                if (result == null || result == '') {
                    const V = new Validator(req.body, {
                        day_name: "required",
                        from: "required",
                        to: "required",
                        slot_duration: "required",
                        language: "required"
                    })
                    let matched = V.check().then(val => val)

                    if (!matched) {
                        res.status(400).json({ status: false, error: V.errors })
                    }

                    var ranges = []           // start times array
                    var nietos = []           // array of objects with {starttime, endtime}
                    let single_slot = {}      // object with single slot start time, end time

                    var starttime = convertTime12to24(req.body.from)          // see below for utility functions
                    var endtime = convertTime12to24(req.body.to)              // see below for utility functions
                    var interval = req.body.slot_duration
                    var language = req.body.language

                    // console.log("Start time", starttime)
                    // console.log("End time", endtime)

                    var st_InMin4m12AM = convertH2M(starttime)         // see below for utility functions
                    var et_InMin4m12AM = convertH2M(endtime)           // see below for utility functions

                    console.log("Start time", st_InMin4m12AM)
                    console.log("End time", et_InMin4m12AM)

                    var timeRanges = getTimeRanges(ranges, st_InMin4m12AM, et_InMin4m12AM, interval, language)// see below for utility functions

                    console.log(timeRanges)

                    enterObjectsInArr(ranges, nietos)          // see below for utility functions
                    console.log("Timings", nietos)

                    let saveData1 = {
                        _id: mongoose.Types.ObjectId(),
                        day_name: element.value,
                        from: req.body.from,
                        to: req.body.to,
                        available_duration: req.body.available_duration,
                        slot_duration: req.body.slot_duration,
                        language: req.body.language,
                        shop_service_id: mongoose.Types.ObjectId(req.body.shop_service_id),
                        category_id: mongoose.Types.ObjectId(req.body.category_id),
                        seller_id: mongoose.Types.ObjectId(req.body.seller_id)
                    }

                    const SELLER_TIMINGS = new sellerTimings(saveData1)

                    SELLER_TIMINGS.save()
                        .then(data => {
                            console.log("Seller availability", data)
                            nietos.forEach(item => {
                                let saveData2 = {
                                    _id: mongoose.Types.ObjectId(),
                                    category_id: mongoose.Types.ObjectId(data.category_id),
                                    shop_service_id: mongoose.Types.ObjectId(data.shop_service_id),
                                    weekday_name: element.value,
                                    timing: item,
                                    slot_duration: data.slot_duration
                                }
                                data.addSlots(saveData2)
                            })
                        })
                }
                else {
                    next()
                    // return res.status(500).json({
                    //     status: false,
                    //     error: "Slots for the day already exists.",
                    //     data: null
                    // });
                }
            })
    })

    // return res.redirect(`/v1/user/shop-service/weekly-timings/${req.body.shop_service_id}`);
    return sellerTimings.find(
        {
            // $and: [
            //     {
            shop_service_id: mongoose.Types.ObjectId(req.body.shop_service_id)
            //     },
            //     {
            //         weekday_name: {
            //             $in: selectDays
            //         }
            //     }
            // ]
        },
        { new: true },
        (err, docs) => {
            if (!err) {
                console.log("New slots", docs)
                res.status(200).json({
                    status: true,
                    message: "Slots created successfully for the day.",
                    data: docs
                })
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Failed to add slot. Server error.",
                    error: err.message
                })
            }
        })
}

var viewShopServiceTimings = async (req, res) => {
    let shop_service_id = req.params.id    // shop_service_id in params
    return sellerTimings.find({ shop_service_id: mongoose.Types.ObjectId(shop_service_id) })
        .then(data => {
            if (data == null || data == '') {
                res.status(200).json({
                    status: true,
                    message: "This seller currently isn't providing any service in this category.",
                    data: data
                })
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "Weekly service time for the seller",
                    data: data
                })
            }
        }).catch(err => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err.message
            })
        })
}

var editTimingNSlots = async (req, res) => {
    const V = new Validator(req.body, {
        from: "required",
        to: "required",
        slot_duration: "required"
    })

    let matched = V.check().then(val => val)
    if (!matched) {
        return res.status(400).json({ status: false, message: V.errors })
    }

    var id = req.params.id;
    // update with _id of seller_timings table
    return sellerTimings.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        req.body,
        { new: true }
    )
        .then(async (docs) => {
            console.log("Slot timings", docs);
            var deleteSlots = await sellerSlots.deleteMany(
                {
                    shop_service_id: mongoose.Types.ObjectId(docs.shop_service_id),
                    weekday_name: docs.day_name
                },
                (fault, result) => {
                    console.log(result)
                }
            )

            var ranges = []           // start times array
            var nietos = []           // array of objects with {starttime, endtime}
            let single_slot = {}      // object with single slot start time, end time

            var starttime = convertTime12to24(req.body.from)          // see below for utility functions
            var endtime = convertTime12to24(req.body.to)              // see below for utility functions
            var interval = req.body.slot_duration
            var language = docs.language

            // console.log("Start time", starttime)
            // console.log("End time", endtime)

            var st_InMin4m12AM = convertH2M(starttime)         // see below for utility functions
            var et_InMin4m12AM = convertH2M(endtime)           // see below for utility functions

            console.log("Start time", st_InMin4m12AM)
            console.log("End time", et_InMin4m12AM)

            var timeRanges = getTimeRanges(ranges, st_InMin4m12AM, et_InMin4m12AM, interval, language)// see below for utility functions

            console.log(timeRanges)

            enterObjectsInArr(ranges, nietos)          // see below for utility functions
            console.log("Timings", nietos)

            nietos.forEach(element => {
                let saveData = {
                    _id: mongoose.Types.ObjectId(),
                    category_id: mongoose.Types.ObjectId(docs.category_id),
                    shop_service_id: mongoose.Types.ObjectId(docs.shop_service_id),
                    weekday_name: docs.day_name,
                    timing: element,
                    slot_duration: docs.slot_duration
                }
                docs.addSlots(saveData)
            })

            res.status(200).json({
                status: true,
                message: "Schedule has been updated.",
                data: docs
            })
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            })
        })
}

var deleteTimingNSlots = async (req, res) => {
    // delete with _id of seller_timings table
    var id = req.params.id;

    var deleteTiming = await sellerTimings.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) });
    // console.log("Delete data ", deleteTiming);
    return sellerSlots.deleteMany(
        {
            shop_service_id: mongoose.Types.ObjectId(deleteTiming.shop_service_id), 
            weekday_name: deleteTiming.day_name
        }, 
        (err,docs)=>{
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Slots deleted successfully",
                    timing_data: deleteTiming,
                    slot_data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Failed to delete slots. Server error.",
                    error: err
                });
            }
        }
    );
}

/**=============Utility functions section start==================**/
// Convert timestamp to 24-hour format
const convertTime12to24 = function (time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}

// Convert 24-hour format timestamp to total minutes from 00:00:00
const convertH2M = function (timeInHour) {
    var timeParts = timeInHour.split(":");
    // console.log(timeParts);
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}

// Push date-time data in an empty array
const getTimeRanges = function (arr, start_time, end_time, interval, language = window.navigator.language) {
    const date = new Date();
    const format = {
        hour: 'numeric',
        minute: 'numeric',
    };

    for (let minutes = start_time; minutes <= end_time; minutes = minutes + interval) {
        date.setHours(0);
        date.setMinutes(minutes);
        arr.push(date.toLocaleTimeString(language, format));
    }

    return arr;
}

// Enter objects in an empty arry
const enterObjectsInArr = function (data_arr, emp_arr) {
    for (let i = 0; i < data_arr.length; i++) {
        if (i < data_arr.length - 1) {
            // empty_obj['from'] = data_arr[i];
            // empty_obj['to'] = data_arr[parseInt(i)+parseInt(1)];
            let obj = {
                "from": data_arr[i],
                "to": data_arr[i + 1]
            }
            emp_arr.push(obj);
        }
    }
}
/**=============Utility functions section end==================**/

module.exports = {
    createTimingNSlots,
    viewShopServiceTimings,
    editTimingNSlots,
    deleteTimingNSlots
}