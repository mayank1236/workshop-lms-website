var mongoose = require("mongoose");

const SERVICE_COUPON = require("../../Models/coupon");
const SERVICE_CART = require("../../Models/service_cart");
const SERVICE_CHECKOUT = require("../../Models/checkout");
const Curvalue = require("../../Models/currvalue");

var applyCoupon = async (req, res) => {
    var user_id = req.body.user_id;
    var coup_name = req.body.coup_name;
    // console.log(req.user);



    let coupData = await SERVICE_COUPON.findOne({
        name: req.body.coup_name,
        status: true,
    }).exec();
    console.log("coupData" + coupData);

    if (coupData.times == 0) {
        return res.status(500).json({
            status: false,
            error: "This coupon is not available anymore.",
            data: null
        });
    }
    else {
        let couponUsedOrNot = await SERVICE_CHECKOUT.findOne({
            user_id: mongoose.Types.ObjectId(user_id),
            "coupon.name": coupData.name
        }).exec();

        if (couponUsedOrNot != null) {
            return res.status(500).json({
                status: false,
                error: "This coupon has already been used",
                data: null
            });
        }
        else {
            SERVICE_CART.updateMany(
                {
                    user_id: mongoose.Types.ObjectId(user_id),
                    status: true
                },
                { $set: { coupon: coup_name } },
                { multi: true },
                (err, docs) => {
                    if (err) {
                        console.log("Failed to update in cart due to ", err.message);
                    }
                }
            ).exec();

            if (req.user.currency != "CAD") {

                let conVert = await Curvalue.find({ from: "CAD", to: req.user.currency }).exec();
                let cal = coupData.minprice * conVert[0].value
                coupData.minprice = cal.toFixed(2)

                if (coupData.discount_type == 'Flat discount') {

                    // let conVert = await Curvalue.find({from:"CAD",to:req.user.currency}).exec();
                    let cal = coupData.discount_value * conVert[0].value
                    coupData.discount_value = cal.toFixed(2)

                }


            }





            return res.status(200).json({
                status: true,
                message: "Applied coupon info.",
                data: coupData
            });
        }
    }
}

module.exports = {
    applyCoupon
}