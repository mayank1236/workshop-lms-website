var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

var Service = require('../../Models/service_category');
var Subcategory = require('../../Models/subcategory');
var ShopService = require('../../Models/shop_service');

var Upload = require('../../service/upload');
var currconvert = require("../../service/currencyconverter")


const viewAllServices = async (req, res) => {
    return Service.find({ admin_approved: true })
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
    var user_id = req.params.user_id;

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
                        (req.query.servicename != "" && typeof req.query.servicename != "undefined") ?
                            {
                                $match: {
                                    name: { $regex: ".*" + req.query.servicename + ".*", $options: "i" },
                                    status: true
                                }
                            }
                            : { $project: { __v: 0 } },
                        // (req.query.serv_cat_name != "" && typeof req.query.serv_cat_name != "undefined") ?
                        //     {
                        //         $match: {
                        //             category_name: { $regex: ".*" + req.query.serv_cat_name + ".*", $options: "i" },
                        //             status: true
                        //         },
                        //     }
                        //     : { $project: { __v: 0 } },
                        // (req.query.min != "" && typeof req.query.min != "undefined") ||
                        //     (req.query.max != "" && typeof req.query.max != "undefined") ?
                        //     {
                        //         $match: {
                        //             $expr: {
                        //                 $and: [
                        //                     { $gte: ["$price", Number(req.query.min)] },
                        //                     { $lte: ["$price", Number(req.query.max)] },
                        //                     { status: true }
                        //                 ]
                        //             }
                        //         }
                        //     }
                        //     : { $project: { __v: 0 } },
                        {
                            $match: {
                                category_id: { $in: [mongoose.Types.ObjectId(id)] },
                                status: true
                            }
                        },
                        {
                            $lookup: {
                                from: "service_categories",
                                localField: "category_id",
                                foreignField: "_id",
                                as: "category_details"
                            }
                        },
                        // {
                        //     $unwind: "$category_details"
                        // },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "seller_details"
                            }
                        },
                        {
                            $lookup: {
                                from: "service_carts",
                                let: {
                                    service_id: "$_id",
                                    user_id: mongoose.Types.ObjectId(user_id),
                                    status: true
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$service_id", "$$service_id"] },
                                                    { $eq: ["$user_id", "$$user_id"] },
                                                    { $eq: ["$status", "$$status"] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: "cart_items"
                            }
                        },
                        {
                            $addFields: {
                                totalAdded: {
                                    $cond: {
                                        if: { $isArray: "$cart_items" },
                                        then: { $size: "$cart_items" },
                                        else: null,
                                    },
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: "service_reviews",
                                localField: "_id",
                                foreignField: "service_id",
                                as: "rev_data"
                            }
                        },
                        {
                            $addFields: {
                                avgRating: {
                                    $avg: {
                                        $map: {
                                            input: "$rev_data",
                                            in: "$$this.rating"
                                        }
                                    }
                                }
                            }
                        },
                        typeof req.query.shortby != "undefined" && req.query.shortby == "newarrivals"
                            ? { $sort: { _id: -1 } }
                            : { $project: { __v: 0 } },

                        typeof req.query.shortby != "undefined" && req.query.shortby == "highlow"
                            ? { $sort: { price: -1 } }
                            : { $project: { __v: 0 } },

                        typeof req.query.shortby != "undefined" && req.query.shortby == "lowhigh"
                            ? { $sort: { price: 1 } }
                            : { $project: { __v: 0 } },

                        typeof req.query.shortby != "undefined" && req.query.shortby == "lowhighrev"
                            ? { $sort: { avgRating: 1 } }
                            : { $project: { __v: 0 } },

                        typeof req.query.shortby != "undefined" && req.query.shortby == "highlowrev"
                            ? { $sort: { avgRating: -1 } }
                            : { $project: { __v: 0 } },

                        typeof req.query.shortby != "undefined" && req.query.shortby == "bestselling"
                            ? { $sort: { totalAdded: -1 } }
                            : { $project: { __v: 0 } },

                        typeof req.query.shortby != "undefined" && req.query.shortby == "lowhighsell"
                            ? { $sort: { totalAdded: 1 } }
                            : { $project: { __v: 0 } },

                        typeof req.query.shortby != "undefined" && req.query.shortby == "highlowsell"
                            ? { $sort: { totalAdded: -1 } }
                            : { $project: { __v: 0 } },
                        {
                            $project: {
                                _v: 0
                            }
                        }
                    ]
                ), options,async function (err, docs) {
                    if (!err) {
                        let newRes = docs;
                                
        for (let index = 0; index < newRes.itemsList.length; index++) {
            var element = newRes.itemsList[index];
  
            if (req.query.currency != '' && typeof req.query.currency != 'undefined' && element.currency != req.query.currency) {
  
              // var total = val * element.selling_price;
              let resuss = await currconvert.currencyConvTR(element.price,element.currency,req.query.currency)
  
              // console.log(resuss)
  
              newRes.itemsList[index].price = resuss 
 
  
  
          }  

        }
  
        if((req.query.min != "" && typeof req.query.min != "undefined") ||
          (req.query.max != "" && typeof req.query.max != "undefined"))
          {
            console.log('a')
            for (let index = 0; index < newRes.itemsList.length; index++) {
              var element = newRes.itemsList[index];
              if(Number(element.price) >= req.query.min && Number(element.price) <= req.query.max)
              {
                // newRes = newRes
                console.log(element)
                newRes.itemsList = element
              }
            }
     
            
          }
                        console.log(docs);
                        res.status(200).json({
                            status: true,
                            message: "All services for this category get successfully.",
                            data: newRes
                        })
                    }
                    else {
                        res.status(500).json({
                            status: false,
                            message: "Invalid id. Server error.",
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

const sellerSuggestCategory = async (req, res) => {
    const v = new Validator(req.body, {
        name: "required",
        description: "required"
    });

    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(400).send({ status: false, error: v.errors });
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
        image: image_url
    }

    let service_category = await new Service(serviceData);

    return service_category.save()
        .then((data) => {
            res.status(200).json({
                status: true,
                message: "Service category suggested.",
                data: data
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

module.exports = {
    viewAllServices,
    viewService,
    viewServiceSubCategory,
    viewShopServicesPerService,
    sellerSuggestCategory
}