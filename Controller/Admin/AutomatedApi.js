const SERVICE_SALE_EARNINGS = require('../../Models/earnings/service_sale_earnings');
const SERVICE_CART = require('../../Models/service_cart');
const SERVICE_REFUND = require('../../Models/service_refund');
const mongoose=require('mongoose');
var Curvalue = require("../../Models/currvalue");

var payForServOrNot = async (req, res) => {
    return SERVICE_SALE_EARNINGS.updateMany(
        {
            refund_status: false,
            claim_status: false
        },
        { $set: { claim_status: true } },
        (err, result) => {
            if (!err) {
                console.log("Newly completed and not refunded seller earning cleared.");
            }
            else {
                console.log("Failed to execute required clearance due to ", err.message);
            }
        }
    );
}

var payForService = async (req, res) => {
    console.log(req)
    return SERVICE_SALE_EARNINGS.findOneAndUpdate(
        {
        _id: mongoose.Types.ObjectId(req.params.id),
        claim_status: true,
        seller_apply: true
    },
        { $set: { paystatus: true } },
        {new:true},
        (err, result) => {
            if (!err) {
               res.status(200).json({
                status:true,
                data:result
               })
            }
            else {
                res.status(500).json({
                    status:false,
                    data:err
                   })
            }
        }
    );
}

var viewPayService=async (req,res)=>{

let profile=await SERVICE_SALE_EARNINGS.aggregate([
    {
        $match: {
            claim_status: true,
            seller_apply: true
        }
    },
    {
        $lookup:{
            from:"users",
            localField:"seller_id",
            foreignField: "_id",
            as:"seller_data"
        }
    },
    {
        $project:{
            __v:0
        }
    }
]).exec()


if (profile.length > 0) {
    let newdata=profile;
        
        for (let index = 0; index < newdata.length; index++) {
          var element = newdata[index];
    //console.log(element.seller_data[index].currency)
          if (element.seller_data[index].currency !=''&& typeof element.seller_data[index].currency!="undefined" && element.seller_data[index].currency!= "CAD") {


  
  
            let datass =await Curvalue.find({ from:element.seller_data[index].currency, to:"CAD"  }).exec()
  
            console.log(datass);
  
            let resuss = element.seller_commission * datass[0].value
  
            newdata[index].seller_commission = resuss
          }
        }
     res.status(200).json({
        status: true,
        message: "Data successfully get.",
        data: newdata
    });

}
   else{
    res.status(400).json({
        status:false,
        message:"profile not found",
      
    })

   }

}

var clearServiceRefunds = async (req, res) => {
    // SERVICE_CART.updateMany(
    //     { refund_request: "Refund initiated" }, 
    //     { $set: { refund_request: "Refunded" } }, 
    //     { multi: true }, 
    //     (err, result) => {
    //         console.log("Couldn't update cart data due to ", err.name);
    //     }
    // );
    
    return SERVICE_REFUND.updateMany(
        { refund_status: false }, 
        { $set: { refund_status: true } },
        (err, result) => {
            if (!err) {
                console.log("Product refunds cleared.");
            }
            else {
                console.log("Failed to clear product refunds due to: ", err.message);
            }
        }
    );
}

var resetRefundClaimStatus = async (req,res) => {
    return SERVICE_CART.updateMany(
        { refund_claim: true }, 
        { $set: { refund_claim: false } }, 
        (err,result) => {
            if (!err) {
                console.log("Refund claim statuses have been reset.");
            }
            else {
                console.log("Failed to reset refund claim statuses due to ", err.message);
            }
        }
    )
}

module.exports = {
    payForServOrNot,
    payForService,
    clearServiceRefunds,
    resetRefundClaimStatus,
    viewPayService
}