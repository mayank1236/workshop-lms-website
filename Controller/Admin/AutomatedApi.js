const SERVICE_SALE_EARNINGS = require('../../Models/earnings/service_sale_earnings');

var payForServOrNot = async (req, res) => {
    return SERVICE_SALE_EARNINGS.updateMany(
        {
            refund_status: false,
            claim_status: false
        },
        { $set: { claim_status: true } },
        { multi: true },
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
        { multi: true },
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

module.exports = {
    payForServOrNot,
    payForService
}