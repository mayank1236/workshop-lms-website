var mongoose = require('mongoose')
var Shop = require('../../Models/shop')
var ShopService = require('../../Models/shop_service')
var Subcategory = require('../../Models/subcategory')
var Upload = require('../../service/upload')

const { Validator } = require('node-input-validator')
const service = require('../../Models/service_category')

const create = async (req,res)=>{
    const v = new Validator(req.body,{
        name: "required",
        price: "required",
        details: "required"
    })
    let matched = v.check().then((val)=>val)
    if(!matched){
        res.status(200).send({status: false, errors: v.errors})
    }
    console.log(req.file)
    let image_url = await Upload.uploadFile(req, "shop_services")
    let shopServiceData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        details: req.body.details,
        category_id: mongoose.Types.ObjectId(req.body.category_id),
        category_name: req.body.category_name,
        user_id: mongoose.Types.ObjectId(req.body.user_id)
    }
    if(typeof(req.body.personalization)!='undefined' || req.body.personalization!=''){
        shopServiceData.personalization = req.body.personalization
    }
    if(typeof(req.body.hashtags)!='undefined' || req.body.hashtags!=''){
        shopServiceData.hashtags = req.body.hashtags
    }
    if(typeof(req.file)!='undefined' || req.file!='' || req.file!=null){
        shopServiceData.image = image_url
    }

    let shop_service = new ShopService(shopServiceData)
    shop_service.save()
      .then((docs)=>{
          res.status(200).json({
              status: true,
              message: "Shop's service created sucessfully!",
              data: docs
          })
      })
      .catch((err)=>{
          res.status(500).json({
              status: false,
              message: "Server error. Please try again",
              errors: err
          })
      })

    // ShopService.find({subcategory_id: {$in: [mongoose.Types.ObjectId(req.body.subcategory_id)]}})
    //   .then(async (data)=>{
    //       if(data==null || data==''){}
    //       else{
    //           ShopService.findOneAndUpdate(
    //             {subcategory_id: {$in: [mongoose.Types.ObjectId(req.body.subcategory_id)]}}, 
    //             // {
    //             //   name: req.body.name,
    //             //   price: req.body.price,
    //             //   details: req.body.details,
    //             //   personalization: req.body.personalization,
    //             //   hashtags: req.body.hashtags
    //             // },
    //             req.body, 
    //             async (err,docs)=>{
    //                 if(err){
    //                     res.status(500).json({
    //                         status: false,
    //                         message: "Server error. Please try again.",
    //                         error: err
    //                     });
    //                 }
    //                 else{
    //                     res.status(200).json({
    //                         status: true,
    //                         message: "Shop service updated successfully!",
    //                         data: docs
    //                     });
    //                 }
    //             }
    //           )
    //       }
    // })
}

const update = async (req,res)=>{
    const v = new Validator(req.body,{
        name: "required",
        price: "required",
        details: "required"
    })
    
    let matched = await v.check().then((val)=>val);
    if(!matched){
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

    let id = req.params.id
    return ShopService.findOneAndUpdate(
        {_id: {$in: [mongoose.Types.ObjectId(id)]}}, 
        req.body, 
        async (err,docs)=>{
            if(err){
                res.status(500).json({
                    status: false,
                    message: "Server error. Please try again.",
                    error: err
                });
            }
            else{
                res.status(200).json({
                    status: true,
                    message: "Shop service updated successfully!",
                    data: docs
                });
            }
        }
      )
}

const viewShopServicesPerSeller = async (req,res)=>{
    let user_id = req.params.user_id          // user_id of shop_services
    ShopService.find({user_id: {$in: [mongoose.Types.ObjectId(user_id)]}})
      .then((data)=>{
        if(data==null || data==''){
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
                        $match:{
                            user_id: {$in: [mongoose.Types.ObjectId(user_id)]}
                        }
                    },
                    {
                        $lookup:{
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "seller_details"
                        }
                    },
                    {
                        $project:{
                            _v:0
                        }
                    }
                ]
            )
            .then((docs)=>{
                res.status(200).json({
                    status: true,
                    message: "All services of this shop get successfully.",
                    data: docs
                })
            })
            .catch((fault)=>{
                res.status(400).json({
                    status: false,
                    message: "Service error2. Please try again",
                    error: fault
                })
            })
        }
      })
      .catch((err)=>{
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: err
        })
    })
}

const viewOneService = async (req,res)=>{
    let category_id = req.params.category_id          // category_id of shop_services
    let user_id = req.params.user_id                  // user_id of shop_services
    ShopService.findOne({
        category_id: {$in: [mongoose.Types.ObjectId(category_id)]}, 
        user_id: {$in: [mongoose.Types.ObjectId(user_id)]}})
        .then((data)=>{
            if(data==null || data==''){
                res.status(200).json({
                    status: true,
                    message: "User has no service for this category",
                    data: []
                })
            }
            else{
                ShopService.aggregate(
                    [
                        {
                            $match:{
                                category_id: {$in: [mongoose.Types.ObjectId(category_id)]}
                            }
                        },
                        {
                            $match:{
                                user_id: {$in: [mongoose.Types.ObjectId(user_id)]}
                            }
                        },
                        {
                            $lookup:{
                                from: "users",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "seller_details"
                            }
                        },
                        {
                            $project:{
                                _v:0
                            }
                        }
                    ]
                  )
                  .then((docs)=>{
                      res.status(200).json({
                          status: true,
                          message: "This shop service get successfully",
                          data: docs
                      })
                  })
                  .catch((fault)=>{
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
        .catch((err)=>{
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: err
            })
        })
}

const Delete = async(req,res)=>{
    let id = req.params.id
    // let category_id = req.params.category_id
    ShopService.findOneAndDelete(
        {_id: {$in: [mongoose.Types.ObjectId(id)]}}
        // {category_id: {$in: [mongoose.Types.ObjectId(category_id)]}}
    ).then(data=>{
        res.status(200).json({
            status: true,
            message: "Successfully deleted the shop service.",
            data: data
        })
    }).catch(err=>{
        res.status(500).json({
            status: false,
            message: "Server error. Couldn't delete data",
            error: err
        })
    })
}

module.exports = {
    create,
    update,
    viewShopServicesPerSeller,
    viewOneService,
    Delete
}