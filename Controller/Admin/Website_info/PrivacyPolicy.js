var mongoose = require('mongoose');

const { Validator } = require('node-input-validator');

var privacyPolicy = require('../../../Models/Website_info/privacy_policy');

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
    if (
        req.body.info_id == null ||
        req.body.info_id == "" ||
        typeof req.body.info_id == "undefined"
    ) {
        const NEW_SEGMENT = new privacyPolicy(segmentData);

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
                    error: err.message
                });
            }
        });
    }
    else {
        return privacyPolicy.findByIdAndUpdate(
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

    return termsNCondin.findById(
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

var editSegment = async (req, res) => {
    var id = req.params.id;

    return termsNCondin.findByIdAndUpdate(
        { _id: id },
        req.body,
        { new: true },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Segment successfully updated.",
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

    return termsNCondin.findByIdAndDelete(
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
    editSegment,
    deleteSegment
}