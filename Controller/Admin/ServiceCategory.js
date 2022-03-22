var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

var Service = require('../../Models/service_category');
var ShopService = require('../../Models/shop_service');

var Upload = require("../../service/upload");

const create = async (req, res) => {
    const v = new Validator(req.body, {
        name: "required",
        description: "required"
    });

    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({
            status: false,
            error: v.errors
        });
    }
    if (typeof (req.file) == 'undefined' || req.file == null) {
        return res.status(200).send({
            status: true,
            error: {
                "image": {
                    "message": "The image field is mandatory.",
                    "rule": "required"
                }
            }
        });
    }
    let image_url = await Upload.uploadFile(req, "services");
    let serviceData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        admin_added: true,
        admin_approved: true,
        image: image_url
    }

    let service_category = await new Service(serviceData);

    return service_category.save()
        .then((data) => {
            res.status(200).json({
                status: true,
                data: data,
                message: "Service category added successfully!"
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            });
        });
}

const viewAllServices = async (req, res) => {
    return Service.find()
        .then((docs) => {
            res.status(200).json({
                status: true,
                message: "All services get successfully.",
                data: docs
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                errors: err
            });
        });
}

const update = async (req, res) => {
    const v = new Validator({
        name: "required",
        description: "required",
    });

    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({
            status: false,
            error: v.errors
        });
    }
    console.log(req.file)
    if (typeof (req.file) != "undefined" || req.file != null) {
        let image_url = await Upload.uploadFile(req, "services");
        req.body.image = image_url;
    }

    return Service.findOneAndUpdate(
        { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
        req.body,
        async (err, docs) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    message: "Server error. Please try again.",
                    error: err
                });
            }
            else if (docs != null) {
                res.status(200).json({
                    status: true,
                    message: "Service category updated successfully!",
                    data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "User do not match",
                    data: null
                });
            }
        }
    );
}

const Delete = async (req, res) => {
    return Service.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.params.id) })
        .then((docs) => {
            res.status(200).json({
                status: true,
                message: "Service category deleted successfully!",
                data: docs
            });
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            });
        });
}

const shopServicePerCategory = async (req, res) => {
    var id = req.params.cat_id;

    return ShopService.aggregate(
        [
            {
                $match: { category_id: mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "seller_data"
                }
            },
            {
                $unwind: "$seller_data"
            },
            {
                $lookup: {
                    from: "admin_commissions",
                    localField: "_id",
                    foreignField: "service_id",
                    as: "admin_commission_data"
                }
            },
            {
                $unwind: "$admin_commission_data"
            }
        ]
    ).then(data=>{
        res.status(200).json({
            status: true,
            message: "All shop services for this category successfully get.",
            data: data
        });
    }).catch(err=>{
        res.status(500).json({
            status: false,
            message: "Invalid id. Server error.",
            error: err
        });
    })
}

var suggestedCategories = async (req,res) => {
    let suggestions =  await Service.find({ admin_added: false }).exec();

    if (suggestions.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Suggested categories successfully get.",
            data: suggestions
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No suggested category.",
            data: suggestions
        });
    }
}

var approveSuggestedCategory = async (req,res) => {
    var id = req.params.id;

    return Service.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) }, 
        { $set: { admin_approved: req.body.approve } }, 
        { new: true }
    )
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Category approved",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            });
        });
}

module.exports = {
    create,
    viewAllServices,
    update,
    Delete,
    shopServicePerCategory,
    suggestedCategories,
    approveSuggestedCategory
}