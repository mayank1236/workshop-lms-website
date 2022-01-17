var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var uuidv1 = require('uuid').v1;
var Product = require('../../Models/product');
var RequestCategory = require('../../Models/request_product');

const { Validator } = require('node-input-validator');

const viewProductList = async( req ,res )=>
{
    return Product.aggregate(
        [
            {
                $lookup:{
                    from:"categories",
                    localField:"catID",
                    foreignField: "_id",
                    as:"category_data"
                }
            },
            {
                $project:{
                    _v:0
                }
            }
        ]
    ).then((data)=>{
        res.status(200).json({
            status:true,
            message:'Product Data Get Successfully',
            data:data
        })
    })
    .catch((err)=>{
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: error,
          });
    })
}

const viewSingleProduct = async (req,res)=>{
    let id=req.params.id;
    return Product.findOne(
        {_id: { $in : [mongoose.Types.ObjectId(id)] } },
        (err,docs)=>{
        if(err){
            res.status(400).json({
                status: false,
                message: "Server error. Data not available",
                error: err
            });
        }
        else {
            res.status(200).json({
                status: true,
                message: "Product get successfully",
                data: docs
            });
        }
    });
}


const create = async(req,res)=>{
    const v = new Validator(req.body, {
        name: "required",
        user_id: "required",
        description: "required",
      });

    let matched = await v.check().then((val)=>val)
    if(!matched)
    {
        return res.status(200).send({
            status:false,
            error:v.errors
        })
    }

    let requestedcategoryData = {
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        user_id:mongoose.Types.ObjectId(req.body.user_id),
        description:req.body.description
    }

    const requestedcategory = await new RequestCategory(requestedcategoryData)
    return requestedcategory
           .save()
           .then((data)=>{
            res.status(200).json({
                status: true,
                message: "New Category Requested successfully",
                data: data,
           })
        })
        .catch((error)=>{
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: error,
            });
        })
}

module.exports = {
    viewProductList,
    viewSingleProduct,
    create
}