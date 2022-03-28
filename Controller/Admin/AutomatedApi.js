const SERVICE_SALE_EARNINGS = require('../../Models/earnings/service_sale_earnings');
const SERVICE_CART = require('../../Models/service_cart');
const SERVICE_REFUND = require('../../Models/service_refund');

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
    return SERVICE_SALE_EARNINGS.updateMany(
        {
            claim_status: true,
            seller_apply: true
        },
        { $set: { paystatus: true } },
        (err, result) => {
            if (!err) {
                console.log("Seller claimed earnings paid.");
            }
            else {
                console.log("Failed to execute required payments due to ", err.message);
            }
        }
    );
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
    resetRefundClaimStatus
}