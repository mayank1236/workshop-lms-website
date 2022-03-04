var mongoose = require('mongoose');
var Service = require('../../Models/service_category');
var Shop = require('../../Models/shop');
var Subcategory = require('../../Models/subcategory');
var ShopService = require('../../Models/shop_service');

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

const viewService = async (req, res) => {
    let id = req.params.id;
    return Service.findOne(
        { _id: { $in: [mongoose.Types.ObjectId(id)] } },
        (err, docs) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Server error. Data not available",
                    error: err
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "Service get successfully",
                    data: docs
                });
            }
        });
}

const viewServiceSubCategory = async (req, res) => {
    Subcategory.find({ serviceid: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
        .then((data) => {
            res.status(200).json({
                status: true,
                message: "Service sub-categries get successfully.",
                data: data
            })
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            })
        })
}

const viewShopServicesPerService = async (req, res) => {
    var id = req.params.id       // _id of 'service_categories' table in params

    const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter',
        meta: 'paginator'
    }

    const options = {
        page: req.params.page,
        limit: 8,
        customLabels: myCustomLabels
    }

    ShopService.find({ category_id: { $in: [mongoose.Types.ObjectId(id)] } })
        .then((data) => {
            if (data == null || data == '') {
                res.status(200).json({
                    status: true,
                    message: "This service category doesn't have any services currently.",
                    data: data
                })
            }
            else {
                ShopService.aggregatePaginate(ShopService.aggregate(
                    [
                        {
                            $match: {
                                category_id: { $in: [mongoose.Types.ObjectId(id)] }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "seller_details"
                            }
                        },
                        {
                            $project: {
                                _v: 0
                            }
                        }
                    ]
                ), options, function (err, docs) {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            message: "All services for this category get successfully.",
                            data: docs
                        })
                    }
                    else {
                        res.status(500).json({
                            status: false,
                            message: "Failed to get data. Server error.",
                            error: err.message
                        })
                    }
                })
            }
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            })
        })
}

module.exports = {
    viewAllServices,
    viewService,
    viewServiceSubCategory,
    viewShopServicesPerService
}