var mongoose = require('mongoose')
var Checkout = require('../../Models/checkout')
var ServiceCart = require('../../Models/service_cart')

const { Validator } = require('node-input-validator')

var create = async (req, res) => {
    const V = new Validator(req.body, {
        user_id: "required",
        subtotal: "required",
        total: "required",
        firstname: "required",
        lastname: "required",
        address1: "required",
        country: "required",
        state: "required",
        zip: "required"
        // payment_type: "required"
    })
    let matched = V.check().then(val => val)

    if (!matched) {
        return res.status(400).json({ state: false, error: V.errors })
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
        zip: req.body.zip
        // payment_type: req.body.payment_type,
    }
    if (
        req.body.discount_percent != "" &&
        req.body.discount_percent != null &&
        typeof (req.body.discount_percent) != undefined
    ) {
        saveData.discount_percent = req.body.discount_percent

        var payableAmt = req.body.subtotal - ((req.body.subtotal * req.body.discount_percent) / 100);
        saveData.total = payableAmt;
    }
    if (
        req.body.coupon_id != "" &&
        req.body.coupon_id != null &&
        typeof (req.body.coupon_id) != undefined
    ) {
        saveData.coupon_id = mongoose.Types.ObjectId(req.body.coupon_id);
    }
    if (
        req.body.coupon != "" &&
        req.body.coupon != null &&
        typeof (req.body.coupon) != undefined
    ) {
        saveData.coupon = req.body.coupon;
    }
    if (
        req.body.email != "" &&
        req.body.email != null &&
        typeof (req.body.email) != undefined
    ) {
        saveData.email = req.body.email
    }
    if (
        req.body.address2 != "" &&
        req.body.address2 != null &&
        typeof (req.body.address2) != undefined
    ) {
        saveData.address2 = req.body.address2
    }
    if (
        req.body.payment_type != "" &&
        req.body.payment_type != null &&
        typeof (req.body.payment_type) != undefined
    ) {
        saveData.payment_type = req.body.payment_type
    }
    if (
        req.body.card_name != "" &&
        req.body.card_name != null &&
        typeof (req.body.card_name) != undefined
    ) {
        saveData.card_name = req.body.card_name
    }
    if (
        req.body.card_no != "" &&
        req.body.card_no != null &&
        typeof (req.body.card_no) != undefined
    ) {
        saveData.card_no = req.body.card_no
    }
    if (
        req.body.card_no != "" &&
        req.body.card_no != null &&
        typeof (req.body.card_no) != undefined
    ) {
        saveData.card_no = req.body.card_no
    }
    if (
        req.body.exp_date != "" &&
        req.body.exp_date != null &&
        typeof (req.body.exp_date) != undefined
    ) {
        saveData.exp_date = req.body.exp_date
    }
    if (
        req.body.cvv != "" &&
        req.body.cvv != null &&
        typeof (req.body.cvv) != undefined
    ) {
        saveData.cvv = req.body.cvv
    }

    console.log("Checkout data", saveData);

    const checkout = new Checkout(saveData)
    return checkout
        .save()
        .then(data => {
            // Update the cart items with order_id
            ServiceCart.updateMany(
                { user_id: mongoose.Types.ObjectId(req.body.user_id), status: true },
                {
                    $set: {
                        status: false,
                        order_id: data.order_id,
                        discount_percent: data.discount_percent
                    }
                },
                { multi: true },
                (err, writeResult) => {
                    if (err) {
                        console.log(err.message);
                    }
                }
            );

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

module.exports = {
    create
}