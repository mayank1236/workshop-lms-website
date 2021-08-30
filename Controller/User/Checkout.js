var mongoose = require('mongoose')
var Checkout = require('../../Models/checkout')
var Cart = require('../../Models/service_cart')

const { Validator } = require('node-input-validator')

var create = async (req,res)=>{
    const V = new Validator(req.body,{
        user_id: "required",
        service_ids: "required",
        order_id: "required",
        subtotal: "required",
        total: "required",
        firstname: "required",
        lastname: "required",
        address1: "required",
        country: "required",
        state: "required",
        zip: "required",
        payment_type: "required"
    })
    let matched = V.check().then(val=>val)

    if (!matched) {
        return res.status(400).json({ state: false, error: V.errors })
    }

    let saveData = {
        _id: mongoose.Types.ObjectId(),
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        service_ids: req.body.service_ids,
        order_id: Number(
            `${new Date().getDate()}${new Date().getHours()}${new Date().getSeconds()}${new Date().getMilliseconds()}`
        ),
        subtotal: req.body.subtotal,
        total: req.body.total
    }
}

module.exports = {
    create
}