var mongoose = require('mongoose');

var sellerSlots = require('../../../Models/Slot/seller_slots');
var sellerBookings = require('../../../Models/Slot/seller_bookings');
var userBookedSlot = require('../../../Models/Slot/user_booked_slot');
var userServiceCart = require('../../../Models/service_cart');
// var adminCommission = require('../../../Models/admin_commission');
var serviceSaleCommission = require('../../../Models/earnings/service_sale_earnings');
var sellerTotalEarning = require('../../../Models/earnings/seller_total_earning');
const Usersubcription=require('../../../Models/subscr_purchase');
var admin_commission=require('../../../Models/adminCommission');
// var adminEarnings = require('../../../Models/earnings/admin_earnings');
const Curvalue = require("../../../Models/currvalue");


var newBookings = async (req, res) => {
    var new_bookings = await sellerBookings.aggregate(
        [
            {
                $match: {
                    seller_id: mongoose.Types.ObjectId(req.params.seller_id),
                    new_booking: true,
                    booking_accept: false,
                    paid: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $lookup: {
                    from: "shop_services",
                    localField: "shop_service_id",
                    foreignField: "_id",
                    as: "shopservice_data"
                }
            },
            {
                $lookup: {
                    from: "service_carts",
                    localField: "user_booking_id",
                    foreignField: "user_booking_id",
                    as: "cart_data"
                }
            },
            {
                $project: {
                    __v: 0
                }
            }
        ]
    ).exec();

    if (new_bookings.length > 0) {
        return res.status(200).json({
            status: true,
            message: "New bookings successfully get.",
            data: new_bookings
        });
    }
    else {
        res.status(200).json({
            status: true,
            message: "No new bookings",
            data: new_bookings
        });
    }
};



var acceptNewBooking = async (req, res) => {
    var id = req.body.id;
    var cur=req.body.currency;
    console.log(cur);


    await sellerBookings.findOne({ _id: mongoose.Types.ObjectId(id) })
        .then(async (data) => {
            res.status(200).json({
                           
                data:data
             });
         
            var payment_status = await userServiceCart.findOne(
                {
                    user_booking_id: data.user_booking_id,
                    status: false
                }
            ).exec();
            // console.log("Service cart data ", payment_status);
       
      
            var userBookedSlotData = await userBookedSlot.findOneAndUpdate(
                {
                    _id: payment_status.user_booking_id,
                    slot_id: payment_status.slot_id
                },
                { $set: { seller_confirmed: true } },
                { returnNewDocument: true }
            ).exec();

           return sellerBookings.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(req.body.id),
                    new_booking: true,
                    booking_accept: false
                },
                {
                    $set: {
                        new_booking: false,
                        booking_accept: true
                    }
                },
                { new: true }
            )
                .then(async (docs) => {
                  //  console.log("Updated seller booking ", docs);

              

                 return false
             
                    var serviceCartData = await userServiceCart.findOneAndUpdate(
                        {
                            user_booking_id: docs.user_booking_id,
                            slot_id: docs.slot_id
                        },
                        {
                            $set: {
                                seller_confirmed: true
                               
                            }
                        },
                        { new: true }
                    ).exec();  

          var userSub=await Usersubcription.find({userid: mongoose.Types.ObjectId(docs.seller_id),status:true}).exec();            
           

                    var seller_earning = 0;
                    var admin_earning=0;

                    if (
                        payment_status.discount_percent != "" ||
                        payment_status.discount_percent != null ||
                        typeof payment_status.discount_percent != "undefined"
                    ) {
                        var discountAmt = (payment_status.price * payment_status.discount_percent) / 100;
                        
                        let sellPrice = payment_status.price - discountAmt;
                        seller_earning = (sellPrice * userSub[0].seller_comission)/100
                        admin_earning = sellPrice - seller_earning
                    }
                    else {
                        seller_earning = (payment_status.price * userSub[0].seller_comission)/100
                        admin_earning = payment_status.price - seller_earning
                    }
                    console.log("before convert",seller_earning,admin_earning)

                     let new_seller_com =0
                     let new_admin_com = 0 ;  
                    if(req.user.currency!=payment_status.currency){
                      
                      
                        let convert=await Curvalue.find({from:payment_status.currency,to:req.user.currency}).exec()
                        let val=seller_earning*convert[0].value
                        
                        new_seller_com=val.toFixed(2);
                         
                    }
                    else{

                      
                        new_seller_com=seller_earning;
                       


                    }

                    if(payment_status.currency!="CAD"){
                      
                      
                        let convert=await Curvalue.find({from:payment_status.currency,to:"CAD"}).exec()
                        let val=admin_earning*convert[0].value
                        
                        new_admin_com=val.toFixed(2);
                         
                       

                    }
                    else{

                      
                        new_admin_com=admin_earning;
                       


                    }
                   
                    let obj = {
                        seller_booking_id: docs._id,
                        seller_id: docs.seller_id,
                        service_id: docs.shop_service_id,
                        user_booking_id: docs.user_booking_id,
                        user_id: docs.user_id,
                        cart_id: payment_status._id,
                        order_id: Number(payment_status.order_id),
                        admin_commission: Number(new_admin_com)
                    }
                    const New_Admin_Earning = new admin_commission(obj);
                    New_Admin_Earning.save().then((data)=>{
                       // console.log("data" +data);
                    })

                   

                    let obj1 = {
                        seller_booking_id: docs._id,
                        seller_id: docs.seller_id,
                        service_id: docs.shop_service_id,
                        user_booking_id: docs.user_booking_id,
                        user_id: docs.user_id,
                        cart_id: payment_status._id,
                        order_id: Number(payment_status.order_id),
                        seller_commission: Number(new_seller_com)
                    }
               
                    console.log("after convert",obj1)
                    const NEW_SERVICE_EARNING = new serviceSaleCommission(obj1);
                    NEW_SERVICE_EARNING.save();

                   
                    let totalEarningData = await sellerTotalEarning.findOne({ seller_id: docs.seller_id }).exec();

                    if (totalEarningData == null || totalEarningData == "") {
                        let obj2 = {
                            seller_id: docs.seller_id,
                            total_earning: Number(seller_earning)
                        }
                        const NEW_TOTAL_EARNING = new sellerTotalEarning(obj2);
                        NEW_TOTAL_EARNING.save()
                    }
                    else {
                       
                        totalEarningData.total_earning += seller_earning;
                        totalEarningData.save();
                    }
          

                    res.status(200).json({
                        status: true,
                        message: "Booking accepted.",
                        data: docs
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        status: false,
                        message: "Failed to accept booking. Server error.",
                        error: err.message
                    });
                });
        })
        .catch(fault => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: fault.message
            });
        });
}

// var commssionpercent = Number(service_commission.percentage)
//                             var totalpricee = Number(payment_status.price)
//                             var admincomision = ((commssionpercent / 100) * totalpricee)
//                             var sellercomision = totalpricee - admincomision

//                             let sellersaveDaata = {
//                                     booking_id: mongoose.Types.ObjectId(data._id),
//                                     order_id: mongoose.Types.ObjectId(sellerBookings._id),
//                                     seller_id: mongoose.Types.ObjectId(payment_status.seller_id),
//                                     service_id: mongoose.Types.ObjectId(payment_status.service_id),
//                                     price: Number(payment_status.price),
//                                     commission: sellercomision,
//                                 }

//                             const SELLEREARNINGS = await new sellerEarnings(sellersaveDaata)
//                             SELLEREARNINGS
//                                 .save()
//                                 .then((data) => {
//                                     res.status(200).json({
//                                         status: true,
//                                         message: "New Seller Earnings added successfully",
//                                         data: data,
//                                     })
//                                 })
//                                 .catch((error) => {
//                                     res.status(500).json({
//                                         status: false,
//                                         message: "Server error. Please try again.",
//                                         error: error,
//                                     });
//                                 })

//                             adminsaveDaata = {
//                                 booking_id: mongoose.Types.ObjectId(data._id),
//                                 order_id: mongoose.Types.ObjectId(sellerBookings._id),
//                                 seller_id: mongoose.Types.ObjectId(payment_status.seller_id),
//                                 service_id: mongoose.Types.ObjectId(payment_status.service_id),
//                                 price: Number(payment_status.price),
//                                 commission: admincomision,
//                             }
//                             const ADMINEARNINGS = await new adminEarnings(adminsaveDaata)
//                             ADMINEARNINGS
//                                 .save()
//                                 .then((data) => {
//                                     res.status(200).json({
//                                         status: true,
//                                         message: "New ADMIN Earnings added successfully",
//                                         data: data,
//                                     })
//                                 })
//                                 .catch((error) => {
//                                     res.status(500).json({
//                                         status: false,
//                                         message: "Server error. Please try again.",
//                                         error: error,
//                                     });
//                                 })

var viewAcceptedBookings = async (req, res) => {
    var accepted_bookings = await sellerBookings.aggregate(
        [
            {
                $match: {
                    seller_id: mongoose.Types.ObjectId(req.params.seller_id),
                    new_booking: false,
                    booking_accept: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $lookup: {
                    from: "shop_services",
                    localField: "shop_service_id",
                    foreignField: "_id",
                    as: "shopservice_data"
                }
            },
            {
                $lookup: {
                    from: "service_carts",
                    localField: "user_booking_id",
                    foreignField: "user_booking_id",
                    as: "cart_data"
                }
            },
            {
                $project: {
                    __v: 0
                }
            }
        ]
    ).exec();

    if (accepted_bookings.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All accepted bookings successfully get.",
            data: accepted_bookings
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No bookings accepted till date.",
            data: accepted_bookings
        });
    }
};

var rejectNewBooking = async (req, res) => {
    return sellerBookings.findOneAndUpdate(
        {
            _id: mongoose.Types.ObjectId(req.params.id),        
            // new_booking: true,
            // booking_accept: false
        },
        {
            $set: {
                new_booking: false,
                booking_accept: false
            }
        },
        {
            returnNewDocument: true
        },
        async (err, docs) => {
            if (!err) {
                console.log("Seller booking", docs);
                // cancel seller slot booking
                var sellerSlotData = sellerSlots.findOneAndUpdate(
                    {
                        _id: docs.slot_id,
                        // booking_status: true
                    },
                    { $set: { booking_status: false } },
                    { returnNewDocument: true }
                ).exec();

                // if booked service is still in service cart
                var inServiceCart = await userServiceCart.findOne(
                    {
                        user_booking_id: docs.user_booking_id,
                        status: true
                    }
                ).exec();
                // if booked service has been checked out
                var checkedOut = await userServiceCart.findOne(
                    {
                        user_booking_id: docs.user_booking_id,
                        status: false
                    }
                ).exec();

           
                if (inServiceCart != null && checkedOut == null) {
                    var bookingStatus = userServiceCart.findOneAndUpdate(
                        {
                            user_booking_id: docs.user_booking_id,
                            // status: true
                        },
                        { $set: { status: false, seller_confirmed: false, seller_reject:true } },
                        { returnNewDocument: true }
                    ).exec();
                }
                else if (inServiceCart == null && checkedOut != null) {
                    // refund the booked session's amount
                    var bookingStatus = userServiceCart.findOneAndUpdate(
                        {
                            user_booking_id: docs.user_booking_id,
                            // status: false
                        },
                        { $set: { seller_confirmed: false , seller_reject:true} },
                        { returnNewDocument: true }
                    ).exec();
                }

                res.status(200).json({
                    status: true,
                    message: "Booking rejected",
                    data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Failed to reject booking. Server error.",
                    error: err
                });
            }
        }
    );
};

var viewRejectedBookings = async (req, res) => {
    var accepted_bookings = await sellerBookings.aggregate(
        [
            {
                $match: {
                    seller_id: mongoose.Types.ObjectId(req.params.seller_id),
                    new_booking: false,
                    booking_accept: false
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $lookup: {
                    from: "shop_services",
                    localField: "shop_service_id",
                    foreignField: "_id",
                    as: "shopservice_data"
                }
            },
            {
                $lookup: {
                    from: "service_carts",
                    localField: "user_booking_id",
                    foreignField: "user_booking_id",
                    as: "cart_data"
                }
            },
            {
                $project: {
                    __v: 0
                }
            }
        ]
    ).exec();

    if (accepted_bookings.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All rejected bookings successfully get.",
            data: accepted_bookings
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No bookings rejected till date.",
            data: accepted_bookings
        });
    }
};

// Complete service booking
var completeBooking = async (req, res) => {
    var id = req.params.id;

    return userServiceCart.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        {
            $set: {
                completestatus: "complete",
                refund_claim: true
            }
        },
        { new: true }
    )
        .then(async (docs) => {
            let enableUserRefund = await sellerBookings.findOneAndUpdate(
                { user_booking_id: docs.user_booking_id },
                { completestatus: "complete" }
            ).exec();

            res.status(200).json({
                status: true,
                message: "Service request completed.",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            });
        })
}

module.exports = {
    newBookings,
    acceptNewBooking,
    viewAcceptedBookings,
    rejectNewBooking,
    viewRejectedBookings,
    completeBooking,
    
}