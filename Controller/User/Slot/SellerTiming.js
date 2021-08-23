var mongoose = require('mongoose')
var sellerTimings = require('../../../Models/Slot/seller_timing')

const { Validator } = require('node-input-validator')
// const { find } = require('../../../Models/Slot/seller_timing')

var createSlot = async (req,res)=>{
    const v = new Validator(req.body,{
        day_name: "required",
        available_duration: "required"
    })

    let matched = v.check().then(val=>val)
    if(!matched){
        return res.status(400).json({ status: false, message: v.errors })
    }

    sellerTimings.findOne({
        day_name: req.body.day_name,
        shop_service_id: mongoose.Types.ObjectId(req.body.shop_service_id),
        category_id: mongoose.Types.ObjectId(req.body.category_id)
        // seller_id: mongoose.Types.ObjectId(req.body.seller_id)
    }).then(data=>{
        console.log('availability', data)
        if(data==null || data==''){
            let available_days = {
                _id: mongoose.Types.ObjectId(),
                day_name: req.body.day_name,
                from: req.body.from,
                to: req.body.to,
                available_duration: req.body.available_duration,
                shop_service_id: req.body.shop_service_id,
                category_id: req.body.category_id,
                seller_id: req.body.seller_id
            }
    
            var save_day = new sellerTimings(available_days)
            save_day.save()
              .then(docs => {
                  res.status(200).json({
                      status: true,
                      message: "Day saved in schedule",
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
        else {
            return res.status(200).json({
                status: true,
                message: "Timings for this day is already added.",
                data: data
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

module.exports = {
    createSlot,
    viewShopServiceTimings,
    editSlot,
    deleteSlot
}