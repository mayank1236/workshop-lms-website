var mongoose = require('mongoose')

var ShopService = require('../../Models/shop_service')
var AdminCommission = require('../../Models/admin_commission')
var Checkout = require('../../Models/checkout')
var Upload = require('../../service/upload')

const { Validator } = require('node-input-validator')

const create = async (req, res) => {
    const v = new Validator(req.body, {
        name: "required",
        price: "required",
        details: "required"
    })
    let matched = v.check().then((val) => val)
    if (!matched) {
        res.status(200).send({ status: false, errors: v.errors })
    }
    console.log(req.files)
    // let image_url = await Upload.uploadFile(req, "shop_services")
    let video_url = await Upload.uploadVideoFile(req, "shop_services")
    let shopServiceData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        details: req.body.details,
        category_id: mongoose.Types.ObjectId(req.body.category_id),
        category_name: req.body.category_name,
        user_id: mongoose.Types.ObjectId(req.body.user_id)
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
        shopServiceData.video = video_url
    }

    let shop_service = new ShopService(shopServiceData)
    shop_service.save()
        .then(async (docs) => {
            let commissionData = {
                _id: mongoose.Types.ObjectId(),
                service_id: docs._id,
                category_id: docs.category_id
            }
            
            const ADMIN_COMMISSION = new AdminCommission(commissionData)

            var save_admin_commission = await ADMIN_COMMISSION.save()

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
                errors: err
            })
        })
}

const shopserviceImageUrl = async(req,res)=>{
    let imagUrl = '';
    let image_url = await Upload.uploadFile(req, "shop_services")
    if(typeof(req.file)!='undefined' || req.file!='' || req.file!=null){
        imagUrl = image_url
    }

    return res.status(200).send({
        status : true,
        data : imagUrl,
        error : null
    })
}

const shopserviceAudioUrl = async(req,res)=>{
    let audioUrl = '';
    let audio_url = await Upload.uploadAudioFile(req, "shop_services");
    if(typeof(req.file)!='undefined' || req.file!='' || req.file!=null){
        audioUrl = audio_url
    }

    return res.status(200).send({
        status : true,
        data : audioUrl,
        error : null
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
    console.log(req.file)
    if (typeof (req.file) != "undefined" || req.file != null) {
        let image_url = await Upload.uploadFile(req, "shop_services");
        req.body.image = image_url;
    }
    if (
        typeof (req.body.hashtags) != 'undefined' || 
        req.body.hashtags != '' || 
        req.body.hashtags != null
        ) {
        req.body.hashtags = JSON.parse(req.body.hashtags)
    }

    let id = req.params.id
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
    let id = req.params.id
    ShopService.findOne({ _id: { $in: [mongoose.Types.ObjectId(id)] } })
        .then(data => {
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
                        $project: {
                            _v: 0
                        }
                    }
                ]
            )
                .then(result => {
                    res.status(200).json({
                        status: true,
                        message: "Shop service details successfully get.",
                        data: result
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

const viewTopServiceProvider = async (req,res)=>{
    // Cart
    ShopService
    .aggregate(
        [
            {
                $group:{
                    _id:'$_id'
                }
            },
            {
                $lookup:{
                    from:'service_carts',
                    // localField:'order_id',
                    // foreignField:'order_id',
                    let:{
                        'service_id':'$_id'
                    },
                    pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $and:[
                                        { $eq: ['$service_id', '$$service_id'] }
                                    ]
                                }
                            }
                        },
                        {
                            $group:{
                                _id:"$service_id",totalCount :{$sum:1}
                            }
                        },
                        {
                            $sort:{totalCount:-1}
                        },
                    ],
                    as:'cart_data'
                }
            },
            {
                $unwind:"$cart_data"
            },
            {
                $lookup:{
                    from:"shop_services",
                    localField:"cart_data._id",
                    foreignField:"_id",
                    as:"service_data"
                }
            },
            {
                $unwind:"$service_data"
            },
            {
                $lookup:{
                    from:"service_categories",
                    localField:"service_data.category_id",
                    foreignField:"_id",
                    as:"category_data"
                }
            },
            {
                $unwind:"$category_data"
            },
            {
                $lookup:{
                    from:"users",
                    localField:"service_data.user_id",
                    foreignField:"_id",
                    as:"provider_data"
                }
            },
            {
                $unwind:"$provider_data"
            },
            {
                $project:{
                    _v:0
                }
            },
            {
                $lookup:{
                    from:"service_reviews",
                    localField:"service_data._id",
                    foreignField: "service_id",
                    // pipeline:[ {$limit: 0} ],
                    as:"rev_data"
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
        ]
    )
    .then(data=>{
        res.status(200).json({
            status: true,
            message: "Popular services get successfully",
            data: data
        })
    })
    .catch(err=>{
        res.status(500).json({
            status: false,
            message: "Failed to get popular shop service data. Server error.",
            error: err
        });
    })
}

module.exports = {
    create,
    shopserviceImageUrl,
    shopserviceAudioUrl,
    update,
    Delete,
    viewShopServicesPerSeller,
    viewOneService,
    chatImageUrlApi,
    viewShopServiceDetails,
    viewTopServiceProvider
}