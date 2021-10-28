var mongoose = require('mongoose');

var privacyPolicy = require('../../../Models/Website_info/privacy_policy');

var viewAllSegments = async (req, res) => {
    var privacyInfo = await privacyPolicy.find().exec();

    if (privacyInfo.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: privacyInfo
        });
    }
    else {
        return res.status(500).json({
            status: false,
            error: "Failed to get data. Server error.",
            data: null
        });
    }
}

var viewSegmentById = async (req, res) => {
    var id = req.params.id;

    return privacyPolicy.findById(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Segment successfully get.",
                    data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Invalid id.",
                    error: err
                });
            }
        }
    );
}

module.exports = {
    viewAllSegments,
    viewSegmentById
}