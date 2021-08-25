var mongoose = require('mongoose');
const SELLER_SLOTS = require('../../../Models/Slot/seller_slots');

const { Validator } = require('node-input-validator');

var addSellerServiceSlot = async (req,res)=>{
    const V = new Validator(req.body, {
        weekday_name: "required",
        from: "required",
        to: "required"
    });
    let matched = V.check().then(val=>val);

    if (!matched) {
        return res.status(200),json({status: true, error: V.errors})
    }

    let saveData = {
        _id: mongoose.Types.ObjectId(),
        category_id: mongoose.Types.ObjectId(req.body.category_id),
        shop_service_id: mongoose.Types.ObjectId(req.body.shop_service_id),
        weekday_name: req.body.weekday_name,
        from: req.body.from,
        to: req.body.to,
        slot_duration: req.body.slot_duration
    }
    const sellerSlots = new SELLER_SLOTS(saveData);

    sellerSlots.save((err,docs)=>{
        if(!err) {
            res.status(200).json({
                status: true,
                message: "Slot successfully added for the day.",
                data: docs
            })
        }
        else {
            res.status(500).json({
                status: false,
                message: "Server error. Failed to add slot.",
                error: err
            })
        }
    })
}

module.exports = {
    addSellerServiceSlot,
}