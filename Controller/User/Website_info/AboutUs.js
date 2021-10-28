var mongoose = require('mongoose');

var aboutUs = require('../../../Models/Website_info/about_us');

var viewAllSegments = async (req, res) => {
    var aboutUsInfo = await aboutUs.find().exec();

    if (aboutUsInfo.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: aboutUsInfo
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

    return aboutUs.findById(
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