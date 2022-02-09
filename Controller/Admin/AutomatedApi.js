const SERVICE_SALE_EARNINGS = require('../../Models/earnings/service_sale_earnings');

var payForServOrNot = async (req,res) => {
    SERVICE_SALE_EARNINGS.updateMany(
        {
            refund_status: false,
            claim_status: false,
            seller_apply: false,
            paystatus: false
        },
        { $set: { claim_status: true } }, 
        { multi: true }, 
        (err,result) => {
            if (!err) {
                console.log("Newly completed and not refunded seller earning cleared.");
            }
            else {
                console.log("Failed to execute required clearance due to ", err.message);
            }
        }
    );
}

module.exports = {
    payForServOrNot
}