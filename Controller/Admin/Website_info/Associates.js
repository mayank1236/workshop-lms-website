var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

const ASSOCIATE = require('../../../Models/Website_info/associates');
var Upload = require('../../../service/upload');

var addAssociate = async (req, res) => {
    const V = new Validator(req.body, {
        name: 'required',
        image: 'required'
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    let associateData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.body.image
    }
    if (
        req.body.description != "" ||
        req.body.description != null ||
        typeof req.body.description != "undefined"
    ) {
        associateData.description = req.body.description;
    }

    const NEW_ASSOCIATE = new ASSOCIATE(associateData);

    return NEW_ASSOCIATE.save((err, docs) => {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "Data added successfully.",
                data: docs
            });
        }
        else {
            res.status(500).json({
                status: false,
                message: "Failed to add data. Server error.",
                error: err
            });
        }
    });
}

var imageUpload = async (req,res)=>{
    var imageUrl = '';
    var image_url = await Upload.uploadFile(req, "associates");

    if (
        req.file != "" ||
        req.file != null ||
        typeof req.file != "undefined"
    ) {
        imageUrl = image_url;
    }

    return res.status(200).send({
        status: true,
        data: imageUrl,
        error: null
    });
}

var viewAllAssociates = async (req, res) => {
    var associates = await ASSOCIATE.find().exec();

    if (associates.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: associates
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

var viewAssociateById = async (req, res) => {
    var id = req.params.id;

    return ASSOCIATE.findById(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Data successfully get.",
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

var editAssociate = async (req, res) => {
    const V = new Validator(req.body, {
        name: 'required',
        image: 'required'
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    var id = req.params.id;

    return ASSOCIATE.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        req.body,
        { new: true },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Associate info successfully edited.",
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

var deleteAssociate = async (req, res) => {
    var id = req.params.id;

    return ASSOCIATE.findByIdAndDelete(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Partner info deleted successfully.",
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
        });
}

module.exports = {
    addAssociate,
    imageUpload,
    viewAllAssociates,
    viewAssociateById,
    editAssociate,
    deleteAssociate
}