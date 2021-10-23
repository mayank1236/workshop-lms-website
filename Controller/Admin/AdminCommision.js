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
        service_id: req.body.service_id,
        percentage: req.body.percentage
    }
    if (
        req.body.category_id != "" ||
        req.body.category_id != null ||
        typeof req.body.category_id != "undefined"
    ) {
        console.log(req.body.category_id);
        saveData.category_id = req.body.category_id;
    }

    var commissionData = await adminCommission.
        findOne({ service_id: mongoose.Types.ObjectId(req.body.service_id) })
        .exec();
    console.log(commissionData);

    if (commissionData != "" || commissionData != null) {
        return adminCommission.findOneAndUpdate(
            { service_id: mongoose.Types.ObjectId(req.body.service_id) },
            saveData,
            { new: true },
            (err, docs) => {
                if (!err) {
                    res.status(200).json({
                        status: true,
                        message: "Commission percentage added successfully",
                        data: docs
                    });
                }
                else {
                    res.status(500).json({
                        status: false,
                        message: "Failed to add commission. Server error.",
                        error: err.message
                    });
                }
            }
        );
    }

    const SERVICE_COMMISION = new adminCommission(saveData);

    return SERVICE_COMMISION.save((err, docs) => {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "Commission percentage added successfully",
                data: docs
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

module.exports = {
    addNEditCommission
}