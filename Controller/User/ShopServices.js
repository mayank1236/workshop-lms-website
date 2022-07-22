var mongoose = require('mongoose')

var ShopService = require('../../Models/shop_service')
var userSub = require('../../Models/subscr_purchase')
var AdminCommission = require('../../Models/admin_commission')


var Upload = require('../../service/upload')

const { Validator } = require('node-input-validator')
var currconvert = require("../../service/currencyconverter")
var Curvalue = require("../../Models/currvalue")



const create = async (req, res) => {
    const v = new Validator(req.body, {
        name: "required",
        price: "required",
        details: "required",
        currency:"required"
    })
    let matched = v.check().then((val) => val)
    if (!matched) {
        res.status(200).send({ status: false, errors: v.errors })
    }
    console.log(req.file)
    // let image_url = await Upload.uploadFile(req, "shop_services")
    // let video_url = await Upload.uploadVideoFile(req, "shop_services")
    let shopServiceData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        details: req.body.details,
        category_id: mongoose.Types.ObjectId(req.body.category_id),
        category_name: req.body.category_name,
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        currency:req.body.currency
    }
    if (
        typeof (req.body.personalization) != 'undefined' ||
        req.body.personalization != '' ||
        req.body.personalization != null
    ) {
        shopServiceData.personalization = req.body.personalization
    }
    if (
        typeof (req.body.hashtags) == 'undefined' ||
        req.body.hashtags == '' ||
        req.body.hashtags == null
    ) {
        shopServiceData.hashtags = null
    }
    else {
        shopServiceData.hashtags = JSON.parse(req.body.hashtags)
    }
    if (
        typeof (req.body.highlights) == 'undefined' ||
        req.body.highlights == '' ||
        req.body.highlights == null
    ) {
        shopServiceData.highlights = null
    }
    else {
        shopServiceData.highlights = JSON.parse(req.body.highlights)
    }
    if (
        typeof (req.body.image) == 'undefined' ||
        req.body.image == '' ||
        req.body.image == null
    ) {
        shopServiceData.image = null
    } else {
        shopServiceData.image = JSON.parse(req.body.image)
    }
    if (
        req.file != "" ||
        req.file != null ||
        typeof req.file != "undefined"
    ) {
        shopServiceData.video = req.body.video
    }

    let shop_service = new ShopService(shopServiceData)
    shop_service.save()
        .then(async (docs) => {
            // Check user subscription info
            // let subData = await userSub.findOne({ userid: docs.user_id }).exec()

            // var sellerCom = Number(subData.seller_comission)
            // var adminComm = 100 - sellerCom

            let commissionData = {
                _id: mongoose.Types.ObjectId(),
                service_id: docs._id,
                category_id: docs.category_id
                // percentage: adminComm
            }

            const ADMIN_COMMISSION = new AdminCommission(commissionData)
            ADMIN_COMMISSION.save()

            res.status(200).json({
                status: true,
                message: "Shop's service created sucessfully!",
                data: docs
            })
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again",
                errors: err.message
            })
        })
}

const shopserviceImageUrl = async (req, res) => {
    let imagUrl = '';
    let image_url = await Upload.uploadFile(req, "shop_services")
    if (typeof (req.file) != 'undefined' || req.file != '' || req.file != null) {
        imagUrl = image_url
    }

    return res.status(200).send({
        status: true,
        data: imagUrl,
        error: null
    })
}

const shopserviceVideoUrl = async (req, res) => {
    let videoUrl = '';
    let video_url = await Upload.uploadVideoFile(req, "shop_services")
    if (typeof (req.file) != 'undefined' || req.file != '' || req.file != null) {
        videoUrl = video_url
    }

    return res.status(200).send({
        status: true,
        data: videoUrl,
        error: null
    })
}

const update = async (req, res) => {
    const v = new Validator(req.body, {
        name: "required",
        price: "required",
        details: "required"
    })

    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({
            status: false,
            error: v.errors
        });
    }

    if (
        typeof (req.body.hashtags) != 'undefined' ||
        req.body.hashtags != '' ||
        req.body.hashtags != null
    ) {
        req.body.hashtags = JSON.parse(req.body.hashtags)
    }
    if (
        typeof (req.body.highlights) != 'undefined' ||
        req.body.highlights != '' ||
        req.body.highlights != null
    ) {
        req.body.highlights = JSON.parse(req.body.highlights)
    }
    if (
        typeof (req.body.image) == 'undefined' ||
        req.body.image == '' ||
        req.body.image == null
    ) {
        req.body.image = null
    } else {
        req.body.image = JSON.parse(req.body.image)
    }

    var id = req.params.id
    return ShopService.findOneAndUpdate(
        { _id: { $in: [mongoose.Types.ObjectId(id)] } },
        req.body,
        { new: true },
        (err, docs) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    message: "Server error. Please try again.",
                    error: err
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "Shop service updated successfully!",
                    data: docs
                });
            }
        }
    )
}

const Delete = async (req, res) => {
    let id = req.params.id
    // let category_id = req.params.category_id
    ShopService.findOneAndDelete(
        { _id: { $in: [mongoose.Types.ObjectId(id)] } }
        // {category_id: {$in: [mongoose.Types.ObjectId(category_id)]}}
    ).then(data => {
        res.status(200).json({
            status: true,
            message: "Successfully deleted the shop service.",
            data: data
        })
    }).catch(err => {
        res.status(500).json({
            status: false,
            message: "Server error. Couldn't delete data",
            error: err
        })
    })
}

const chatImageUrlApi = async (req, res) => {
    let imagUrl = '';
    let image_url = await Upload.uploadFile(req, "chat")
    if (typeof (req.file) != 'undefined' || req.file != '' || req.file != null) {
        imagUrl = image_url
    }

    return res.status(200).send({
        status: true,
        data: imagUrl,
        error: null
    })
}

const viewShopServicesPerSeller = async (req, res) => {
    let seller_id = req.params.seller_id          // user_id of shop_services
    ShopService.find({ user_id: { $in: [mongoose.Types.ObjectId(seller_id)] } })
        .then((data) => {
            if (data == null || data == '') {
                res.status(200).json({
                    status: true,
                    message: "This seller doesn't have any services currently.",
                    data: data
                })
            }
            else {
                ShopService.aggregate(
                    [
                        {
                            $match: {
                                user_id: { $in: [mongoose.Types.ObjectId(seller_id)] }
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
                )
                    .then((docs) => {
                        res.status(200).json({
                            status: true,
                            message: "All services of this shop get successfully.",
                            data: docs
                        })
                    })
                    .catch((fault) => {
                        res.status(400).json({
                            status: false,
                            message: "Service error2. Please try again",
                            error: fault
                        })
                    })
            }
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            })
        })
}

const viewOneService = async (req, res) => {
    let seller_id = req.params.seller_id              // user_id of shop_services
    let category_id = req.params.category_id          // category_id of shop_services
    ShopService.find({
        user_id: { $in: [mongoose.Types.ObjectId(seller_id)] },
        category_id: { $in: [mongoose.Types.ObjectId(category_id)] }
    })
        .then((data) => {
            console.log(data)
            if (data == null || data == '') {
                res.status(200).json({
                    status: true,
                    message: "User has no service for this category",
                    data: []
                })
            }
            else {
                ShopService.aggregate(
                    [
                        {
                            $match: {
                                category_id: { $in: [mongoose.Types.ObjectId(category_id)] }
                            }
                        },
                        {
                            $match: {
                                user_id: { $in: [mongoose.Types.ObjectId(seller_id)] }
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
                )
                    .then((docs) => {
                        res.status(200).json({
                            status: true,
                            message: "This shop service get successfully",
                            data: docs
                        })
                    })
                    .catch((fault) => {
                        res.status(500).json({
                            status: false,
                            message: "Server error2. Please try again.",
                            error: fault
                        })
                    })
                //   ShopService.aggregate(
                //       [
                //           {
                //               $addFields:{
                //                   shop_details:{
                //                     $match: {
                //                         _id: {$in: [mongoose.Types.ObjectId(id)]}
                //                     },
                //                     $lookup:{
                //                         from: "shops",
                //                         localField: "shop_id",
                //                         foreignField: "_id"
                //                     },
                //                     $project:{
                //                             _v: 0
                //                         }
                //                   }
                //               }
                //           }
                //       ]
                //   )//
                //   .then((docs)=>{
                //       res.status(200).json()
                //   })
            }
        })
        .catch((err) => {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            })
        })
}

const viewShopServiceDetails = async (req, res) => {

   // console.log(req);
    let id = req.params.id
    ShopService.findOne({ _id: { $in: [mongoose.Types.ObjectId(id)] } })
        .then(data => {
           // console.log(data);
         
            ShopService.aggregate(
                [
                    {
                        $match: {
                            _id: { $in: [mongoose.Types.ObjectId(id)] }
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
                        $lookup: {
                            from: "service_reviews",
                            localField: "_id",
                            foreignField: "service_id",
                            pipeline: [
                                {
                                    $lookup:{
                                        from:"users",
                                        localField:"user_id",
                                        foreignField:"_id",                                        
                                        as:"user_data"
                                    }
                                },
                              ],                 
                          
                            as: "review_data"
                        }
                    },                
                    {
                        $addFields: {
                            avgRating: {
                                $avg: {
                                    $map: {
                                        input: "$review_data",
                                        in: "$$this.rating"
                                    }
                                }
                            }
                        }
                    },
                  
                 
                    { $project: { _v: 0 } }
                ]
            )
                .then(async result => {
                    console.log("result"+result);
                    let newRes = result;

                        for (let index = 0; index < newRes.length; index++) {
                        var element = newRes[index];

                        console.log("element"+element);

                        if (req.query.currency != '' && typeof req.query.currency != 'undefined' && element.currency != req.query.currency) {
                            
                            // let resus = await converter.convert(element.currency,req.query.currency,element.selling_price);
                            // console.log(resus)
                            //console.log(req.query.currency);
                            //console.log(element.currency);
                           // let resuss = await currconvert.currencyConvTR(element.price,element.currency,req.query.currency)
                         let datass = await Curvalue.find({from:element.currency,to:req.query.currency}).exec();
                        // console.log(datass);

                         let resuss = element.price * datass[0].value
                         console.log(element.price);
                         console.log(resuss.toFixed(2));
                            newRes[index].price = resuss.toFixed(2)
                            
                        }
                        }
                    res.status(200).json({
                        status: true,
                        message: "Shop service details successfully get.",
                        data: newRes
                    })
                })
                .catch(fault => {
                    res.status(500).json({
                        status: false,
                        message: "Server error. Please try again.",
                        error: fault
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id.",
                error: err
            })
        })
}

const viewTopServiceProvider = async (req, res) => {
    // Cart
    ShopService
        .aggregate(
            [
                {
                    $group: {
                        _id: '$_id'
                    }
                },
                {
                    $lookup: {
                        from: 'service_carts',
                        // localField:'order_id',
                        // foreignField:'order_id',
                        let: {
                            'service_id': '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$service_id', '$$service_id'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: "$service_id", totalCount: { $sum: 1 }
                                }
                            },
                            {
                                $sort: { totalCount: -1 }
                            },
                        ],
                        as: 'cart_data'
                    }
                },
                {
                    $unwind: "$cart_data"
                },
                {
                    $lookup: {
                        from: "shop_services",
                        localField: "cart_data._id",
                        foreignField: "_id",
                        as: "service_data"
                    }
                },
                {
                    $unwind: "$service_data"
                },
                {
                    $lookup: {
                        from: "service_categories",
                        localField: "service_data.category_id",
                        foreignField: "_id",
                        as: "category_data"
                    }
                },
                {
                    $unwind: "$category_data"
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "service_data.user_id",
                        foreignField: "_id",
                        as: "provider_data"
                    }
                },
                {
                    $unwind: "$provider_data"
                },
                {
                    $project: {
                        _v: 0
                    }
                },
                {
                    $lookup: {
                        from: "service_reviews",
                        localField: "service_data._id",
                        foreignField: "service_id",
                        // pipeline:[ {$limit: 0} ],
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
                { $sort: { avgRating: -1 } },
                { $limit: 8 }
            ]
        )
    .then(async data => {
       // console.log(data)

        let newRes = data;

                        for (let index = 0; index < newRes.length; index++) {
                        var element = newRes[index];
                        
                        console.log(req.query.currency);
                        if (req.query.currency != '' && typeof req.query.currency != 'undefined' && typeof element.service_data.currency!=='undefined' && element.service_data.currency != req.query.currency) {
                            
                            console.log(element.service_data.price)
                       
                            let resuss = await currconvert.currencyConvTR(element.service_data.price,element.service_data.currency,req.query.currency)
                            console.log(resuss)
                            newRes[index].service_data.price = resuss
                            
                        }
                        }

        res.status(200).json({
            status: true,
            message: "Popular services get successfully",
            data: newRes
        })
    })
    .catch(err => {
        res.status(500).json({
            status: false,
            message: "Failed to get popular shop service data. Server error.",
            error: err
        });
    })
    // .explain((err, data) => {
    //     if (!err) {
    //         res.status(200).json({
    //             status: true,
    //             message: "Popular services get successfully",
    //             data: data
    //         })
    //     }
    // })
}

module.exports = {
    create,
    shopserviceImageUrl,
    shopserviceVideoUrl,
    update,
    Delete,
    viewShopServicesPerSeller,
    viewOneService,
    chatImageUrlApi,
    viewShopServiceDetails,
    viewTopServiceProvider
}