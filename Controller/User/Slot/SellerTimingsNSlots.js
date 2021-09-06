var mongoose = require('mongoose')
var sellerTimings = require('../../../Models/Slot/seller_timing')
var sellerSlots = require('../../../Models/Slot/seller_slots')

const { Validator } = require('node-input-validator')
// const { find } = require('../../../Models/Slot/seller_timing')

var createSlot = async (req,res)=>{
    sellerTimings.findOne({
        shop_service_id: {$in: [mongoose.Types.ObjectId(req.body.shop_service_id)]},
        day_name: req.body.day_name
    })
    .then(result=>{
        if (result==null || result=='') {
            const V = new Validator(req.body, {
                day_name: "required",
                from: "required",
                to: "required",
                slot_duration: "required",
                language: "required"
            })
            let matched = V.check().then(val=>val)
            
            if (!matched) {
                res.status(200).json({ status: true, error: V.errors })
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
            
            enterObjectsInArr(ranges,nietos)          // see below for utility functions
            console.log("Timings",nietos)
            
            // nietos.forEach(element => {
            //     let saveData2 = {
            //         _id: mongoose.Types.ObjectId(),
            //         category_id: mongoose.Types.ObjectId(req.body.category_id),
            //         shop_service_id: mongoose.Types.ObjectId(req.body.shop_service_id),
            //         weekday_name: req.body.day_name,
            //         timing: element,
            //         slot_duration: req.body.slot_duration
            //     }
            //     var seller_slots = new sellerSlots(saveData2);
            //     seller_slots.save()
            // })
            
            let saveData1 = {
                _id: mongoose.Types.ObjectId(),
                day_name: req.body.day_name,
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
              .then(data=>{
                  console.log("Seller availability", data)
                  nietos.forEach(element => {
                      let saveData2 = {
                          _id: mongoose.Types.ObjectId(),
                          category_id: mongoose.Types.ObjectId(data.category_id),
                          shop_service_id: mongoose.Types.ObjectId(data.shop_service_id),
                          weekday_name: data.day_name,
                          timing: element,
                          slot_duration: data.slot_duration
                      }
                      data.addSlots(saveData2)
                  })
                  
                  res.status(200).json({
                      status: true,
                      message: "Slots created successfully for the day.",
                      data: data
                  })
              })
              .catch(err=>{
                  res.status(500).json({
                      status: false,
                      message: "Failed to add slot. Server error.",
                      error: err
                  })
              })
        }
        else {
            res.status(500).json({
                status: false,
                message: "Slots for the day already exists.",
                data: result
            })
        }
    })
}

var viewShopServiceTimings = async (req,res)=>{
    let shop_service_id = req.params.id    // shop_service_id in params
    return sellerTimings.find({shop_service_id: mongoose.Types.ObjectId(shop_service_id)})
      .then(data => {
          if(data==null || data==''){
              res.status(200).json({
                  status: true,
                  message: "This seller currently isn't providing any service in this category.",
                  data: data
              })
          }
          else{
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
              error: err
            })
    })
}

var editSlot = async (req,res)=>{
    const v = new Validator(req.body,{
        day_name: "required",
        available_duration: "required"
    })

    let matched = v.check().then(val=>val)
    if(!matched){
        return res.status(400).json({ status: false, message: v.errors })
    }
    // update with _id of seller_timings table
    return sellerTimings.findOneAndUpdate(
        {_id: {$in: [mongoose.Types.ObjectId(req.params.id)]}}, 
        req.body,
        (err,docs)=>{
            if(err){
                res.status(500).json({
                    status: false,
                    message: "Server error. Please try again.",
                    error: err
                })
            }
            else{
                res.status(200).json({
                    status: true,
                    message: "Schedule has been updated.",
                    data: docs
                })
            }
        })
}

var deleteSlot = async (req,res)=>{
    // delete with _id of seller_timings table
    return sellerTimings.deleteOne({_id: {$in: [mongoose.Types.ObjectId(req.params.id)]}})
      .then(data => {
          res.status(200).json({
              status: true,
              message: "Available day removed successfully.",
              data: data
          })
      })
      .catch(err => {
          res.status(500).json({
              status: false,
              message: "Server error. Failed to delete data.",
              error: err
          })
      })
}

/**=============Utility functions section start==================**/
// Convert timestamp to 24-hour format
const convertTime12to24 = function(time12h) {
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
const convertH2M = function(timeInHour){
    var timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}

// Push date-time data in an empty array
const getTimeRanges = function(arr, start_time, end_time, interval, language = window.navigator.language) {
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
const enterObjectsInArr = function(data_arr,emp_arr){
    for ( let i = 0; i < data_arr.length; i++ ) {
        if(i<data_arr.length-1)
        {
              // empty_obj['from'] = data_arr[i];
              // empty_obj['to'] = data_arr[parseInt(i)+parseInt(1)];
              let obj = {
                "from":data_arr[i],
                "to":data_arr[i+1]
              }
              emp_arr.push(obj);
        }     
      }
}
/**=============Utility functions section end==================**/

module.exports = {
    createSlot,
    viewShopServiceTimings,
    editSlot,
    deleteSlot
}