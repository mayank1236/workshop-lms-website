var mongoose = require('mongoose')
var Checkout = require('../../Models/checkout');
const  Curvalue=require('../../Models/currvalue')

var viewAll = async (req,res)=>{
    return Checkout.aggregate(
        [
          
            {
                $lookup:{
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            {
                $unwind: {
                    path: "$user_data",
                    preserveNullAndEmptyArrays: true
                }
            },
           
            {
                $lookup:{
                    from: "service_carts",
                    localField: "order_id",
                    foreignField: "order_id",
                    as: "cart_data"
                },
            },
            {
                $unwind: {
                    path: "$cart_data",
                    preserveNullAndEmptyArrays: true
                }
            },
            // { $sort: { "cart_data.booking_date": -1 } },
            {
                $lookup: {
                    from: "user_booked_slots",
                    localField: "cart_data.user_booking_id",
                    foreignField: "_id",
                    as: "cart_data.booked_slot_data"
                }
            },
            // {
            //     $unwind: {
            //         path: "$cart_data.booked_slot_data",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            { $project:{ _id: 0 } }, 
            {
                $group: {
                    _id: "$order_id",
                    // payment_mode: { $push: "$paymenttype"}, 
                    order_subtotal: { $sum: "$cart_data.price" },
                    discount: { $avg: "$cart_data.discount_percent" },
                    user_data: { $push: "$user_data" },
                    cart_data: { $push: "$cart_data" },
                    // service_refund: { $push: "$service_refund" }
                }
            },
            {
                  $lookup: {
                    from: "admincommissions",
                    localField: "cart_data.order_id",
                    foreignField: "order_id",
                    as: "admin_data"
                }
            },
            {
                $unwind:{
                    path:"$admin_data",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $lookup: {
                    from: "shop_services",
                    localField:"cart_data.user_id",
                    foreignField: "user_id",
                    as: "category_data"
                }
            },
            {
                $unwind: {
                    path: "$category_data",
                    preserveNullAndEmptyArrays: true
                }
            },
          
            { $sort: { booking_date: -1 } }
        ]
    )
    .then(async data=>{

       // console.log(data[0].cart_data[0].currency);
        

        for (let index = 0; index < data.length; index++) {
            var element = data[index];
      
            if (element.cart_data[0].currency!="CAD") {
  
               // console.log(element.cart_data[0].currency);
    
    
              let datass =await Curvalue.find({ from:element.cart_data[0].currency, to:"CAD"  }).exec()
    
             // console.log(datass);
    
              let resuss = element.order_subtotal * datass[0].value
    
              data[index].order_subtotal = resuss
            }
          }

        res.status(200).json({
            status: true,
            message: "Order History found successfully",
            data: data
        })
    })
    .catch(err=>{
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: err
        })
    })
}

module.exports = {
    viewAll
}