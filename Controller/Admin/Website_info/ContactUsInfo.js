const { ConnectionClosedEvent } = require('mongodb');
var mongoose = require('mongoose');

var contactUsInfo = require('../../../Models/Website_info/contact_us');
var Address = require('../../../Models/address');

var addNEdit = async (req, res) => {
    let saveData = {
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        phone: Number(req.body.phone),
        address: req.body.address
    }
    if (
        req.body.info_id == "" ||
        req.body.info_id == null ||
        typeof req.body.info_id == "undefined"
    ) {
        const NEW_CONTACT_US_INFO = new contactUsInfo(saveData);

        return NEW_CONTACT_US_INFO.save((err, docs) => {
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
        return contactUsInfo.findByIdAndUpdate(
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
    var contact_us_info = await contactUsInfo.find().exec();

    if (contact_us_info.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: contact_us_info
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

    return contactUsInfo.findById(
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

    return contactUsInfo.findByIdAndDelete(
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

var addaddress = async (req, res) => {
    let addressData = {
        address: req.body.address
    }
    Address.aggregate([
        {
            $match: {
                __v: 0
            }
        },
    ])
        .then((data) => {
            if (data == "") {
                const AddressDataAdd = new Address(addressData);
                AddressDataAdd.save()
            } else {
                // console.log("data", req.body);
                Address.findOneAndUpdate(
                    {
                        ...req.body,
                    },
                )
                    .then((data) => {
                        return res.status(200).json({
                            status: true,
                            message: "Address added Successfully",
                        });
                    }).catch((error) => {
                        return res.status(500).json({
                            status: false,
                            message: "Server error. Please try again.",
                            error: error,
                        });
                    });
            }
        })
        .catch((error) => {
            return res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: error,
            });
        });
}

var getAddress = async (req, res) => {
    Address.aggregate([
        {
            $project: {
                address: 1,
                _id: 0
            }
        },
    ])
        .then((data) => {
            return res.status(200).json({
                status: true,
                message: "Data fetch Successfully",
                data: data[0],
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: error,
            });
        });
}
module.exports = {
    addNEdit,
    viewAll,
    viewById,
    deleteSegment,
    addaddress,
    getAddress
}