var mongoose = require('mongoose');

const { Validator } = require('node-input-validator');

var aboutUs = require('../../../Models/Website_info/about_us');

var addNEditSegment = async (req, res) => {
    const V = new Validator(req.body, {
        description: 'required'
    });
    let matched = V.check().then(val => val)

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    let segmentData = {
        _id: mongoose.Types.ObjectId(),
        description: req.body.description
    }
    if (
        req.body.heading != "" ||
        req.body.heading != null ||
        typeof req.body.heading != "undefined"
    ) {
        segmentData.heading = req.body.heading;
    }

    var about_us_info = await aboutUs.find({ _id: mongoose.Types.ObjectId(req.body.info_id) }).exec();
    console.log(about_us_info);

    if (about_us_info == "" || about_us_info == null) {
        const NEW_SEGMENT = new aboutUs(segmentData);

        return NEW_SEGMENT.save((err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Info added successfully!",
                    data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Failed to add info. Server error.",
                    error: err
                });
            }
        });
    }
    else {
        return aboutUs.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(req.body.info_id) },
            req.body,
            { new: true },
            (err, docs) => {
                if (!err) {
                    res.status(200).json({
                        status: true,
                        message: "Information successfully updated.",
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
}

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

var deleteSegment = async (req, res) => {
    var id = req.params.id;

    return aboutUs.findByIdAndDelete(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Segment successfully deleted.",
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
    addNEditSegment,
    viewAllSegments,
    viewSegmentById,
    deleteSegment
}