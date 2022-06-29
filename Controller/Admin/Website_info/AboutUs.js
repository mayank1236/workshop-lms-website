var mongoose = require('mongoose');

const { Validator } = require('node-input-validator');

var aboutUs = require('../../../Models/Website_info/about_us');
const Upload=require('../../../service/upload');

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
        req.body.image != "" ||
        req.body.image != null ||
        typeof req.body.image != "undefined"
    ) {
        segmentData.image = req.body.image;
    }


    if (
        req.body.heading != "" ||
        req.body.heading != null ||
        typeof req.body.heading != "undefined"
    ) {
        segmentData.heading = req.body.heading;
    }
    if (
        req.body.info_id == "" ||
        req.body.info_id == null ||
        typeof req.body.info_id == "undefined"
    ) {
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
                    error: err.message
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

var uploadImage=async(req,res)=>{
    let image_url="";
    let imageurl = await Upload.uploadFile(req, 'aboutUs')
    if (req.file != null && req.file != '' && typeof (req.file) != 'undefined') {
        image_url = imageurl;
    }
    return res.status(200).json({
        status:true,
        message:"image uploaded succcessfully",
        image:image_url
    })

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
    deleteSegment,
    uploadImage
}