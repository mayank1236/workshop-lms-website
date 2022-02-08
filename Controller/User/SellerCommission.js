var mongoose = require('mongoose');

const SERVICE_SALE_COMMISSIONS = require('../../Models/service_sale_commissions');

var wallet = async (req, res) => {
    var id = req.params.id;

    /**----------------------------- Total earnings -----------------------------*/
    let commissionData = await SERVICE_SALE_COMMISSIONS.find({ seller_id: mongoose.Types.ObjectId(id) });

    var totalEarnings = 0;

    commissionData.forEach(element => {
        totalEarnings = parseInt(totalEarnings) + parseInt(element.seller_commission);
    });
    /**--------------------------------------------------------------------------*/

    res.send({
        total_earnings: totalEarnings,
        earning_settled: 0,
        pending_settlement: 0,
        service_refund_amt: 0,
        claimable_earnings: 0
    });
}

module.exports = {
    wallet
}