var mongoose = require('mongoose');

const { Validator } = require('node-input-validator');

var adminCommission = require('../../Models/admin_commission');

var addNEditCommission = async (req, res) => {
    const V = new Validator(req.body, {
        service_id: 'required',
        percentage: 'required'
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, error: V.errors });
    }

    let saveData = {
        _id: mongoose.Types.ObjectId(),
        service_id: mongoose.Types.ObjectId(req.body.service_id),
        percentage: req.body.percentage
    }
    if (req.body.category_id == "" || req.body.category_id == null || typeof req.body.category_id == "undefined") {
        saveData.category_id = null;
    }
    else {
        console.log(req.body.category_id);
        saveData.category_id = mongoose.Types.ObjectId(req.body.category_id);
    }

    var commissionData = await adminCommission.
        findOne({ service_id: mongoose.Types.ObjectId(req.body.service_id) })
        .exec();
    console.log(commissionData);

    if (commissionData == "" || commissionData == null) {
        const SERVICE_COMMISION = new adminCommission(saveData);

        return SERVICE_COMMISION.save((err, result) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Commission percentage added successfully",
                    data: result
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Failed to add commission. Server error.",
                    error: err.message
                });
            }
        });
    }
    else {

        return adminCommission.findOneAndUpdate(
            { service_id: mongoose.Types.ObjectId(req.body.service_id) },
            { percentage: req.body.percentage },
            { new: true },
            (err, docs) => {
                if (!err) {
                    res.status(200).json({
                        status: true,
                        message: "Commission percentage updated successfully",
                        data: docs
                    });
                }
                else {
                    res.status(500).json({
                        status: false,
                        message: "Invalid id.",
                        error: err.message
                    });
                }
            }
        );
    }
}

module.exports = {
    addNEditCommission
}