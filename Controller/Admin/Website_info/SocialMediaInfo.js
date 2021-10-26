var mongoose = require('mongoose');

var socialMediaInfo = require('../../../Models/Website_info/social_media');

var addNEdit = async (req, res) => {
    let saveData = {
        _id: mongoose.Types.ObjectId(),
        facebook: req.body.facebook,
        twitter: req.body.twitter,
        youtube: req.body.youtube,
        linkedin: req.body.linkedin
    }
    if (
        req.body.info_id == "" ||
        req.body.info_id == null ||
        typeof req.body.info_id == "undefined"
    ) {
        const NEW_SOCIAL_MEDIA_INFO = new socialMediaInfo(saveData);

        return NEW_SOCIAL_MEDIA_INFO.save((err, docs) => {
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
        return socialMediaInfo.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(req.body.info_id) },
            req.body,
            { new: true },
            (err, docs) => {
                if (!err) {
                    res.status(200).json({
                        status: true,
                        message: "Info updated successfully!",
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

var viewAll = async (req, res) => {
    var social_media_info = await socialMediaInfo.find().exec();

    if (social_media_info.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: social_media_info
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

var viewById = async (req, res) => {
    var id = req.params.id;

    return socialMediaInfo.findById(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Info successfully get.",
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

    return socialMediaInfo.findByIdAndDelete(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Info successfully deleted.",
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
    addNEdit,
    viewAll,
    viewById,
    deleteSegment
}