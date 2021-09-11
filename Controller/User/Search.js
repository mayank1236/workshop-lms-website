var mongoose = require('mongoose');
var serviceCategory = require('../../Models/service_category');
var shopService = require('../../Models/shop_service');
var serviceReview = require('../../Models/service_review');

var serviceSearch = async (req, res) => {
    return shopService.aggregate([
      req.body.servicename != "" && typeof req.body.servicename != "undefined"
        ? {
            $match: { name: { $in: [req.body.servicename.toString()] } },
          }
        : { $project: { __v: 0 } },
      req.body.category_id != "" && typeof req.body.category_id != "undefined"
        ? {
            $match: {
              category_id: {
                $in: [mongoose.Types.ObjectId(req.body.category_id)],
              },
            },
          }
        : { $project: { __v: 0 } },
      (req.body.min != "" && typeof req.body.min != "undefined") ||
      (req.body.max != "" && typeof req.body.max != "undefined")
        ? {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: ["$price", req.body.min],
                  },
                  {
                    $lte: ["$price", req.body.max],
                  },
                ],
              },
            },
          }
        : { $project: { __v: 0 } },
      {
        $lookup: {
          from: "service_carts",
          localField: "_id",
          foreignField: "service_id",
          as: "cart_items",
        },
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
          as: "rev_data",
        },
      },
      {
        $addFields: {
          avgRating: {
            $avg: {
              $map: {
                input: "$rev_data",
                in: "$$this.rating",
              },
            },
          },
        },
      },
  
      typeof req.body.sortby != "undefined" && req.body.sortby == "newarrivals"
        ? { $sort: { _id: -1 } }
        : { $project: { __v: 0 } },
  
      typeof req.body.sortby != "undefined" && req.body.sortby == "highlow"
        ? { $sort: { price: -1 } }
        : { $project: { __v: 0 } },
  
      typeof req.body.sortby != "undefined" && req.body.sortby == "lowhigh"
        ? { $sort: { price: 1 } }
        : { $project: { __v: 0 } },
  
      typeof req.body.sortby != "undefined" && req.body.sortby == "lowhighrev"
        ? { $sort: { avgRating: 1 } }
        : { $project: { __v: 0 } },
  
      typeof req.body.sortby != "undefined" && req.body.sortby == "highlowrev"
        ? { $sort: { avgRating: -1 } }
        : { $project: { __v: 0 } },
  
      typeof req.body.sortby != "undefined" && req.body.sortby == "bestselling"
        ? { $sort: { totalAdded: -1 } }
        : { $project: { __v: 0 } },
  
      typeof req.body.sortby != "undefined" && req.body.sortby == "lowhighsell"
        ? { $sort: { totalAdded: 1 } }
        : { $project: { __v: 0 } },
  
      typeof req.body.sortby != "undefined" && req.body.sortby == "highlowsell"
        ? { $sort: { totalAdded: -1 } }
        : { $project: { __v: 0 } },
    ])
      .then((data) => {
        if (data.length > 0) {
          res.status(200).json({
            status: true,
            message: "Service Get Successfully",
            data: data,
          });
        } else {
          res.status(200).json({
            status: false,
            message: "No Data ",
            data: data,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: "No Match",
          data: null,
          err,
        });
      });
};

const allServicesSearch = async (req,res)=>{
    var searchField = req.body.categoryname;
    // const REGEX = new RegExp(req.body.categoryname, 'i');
    // shopService.find({ category_name: REGEX });
    
    return shopService.find({ category_name: {$regex: searchField, $options: '$i'} })
      .then(data=>{
          res.status(200).json({
              status: true,
              message: "All related shop services.",
              data: data
          });
      })
      .catch(err=>{
        res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: err
        });
    });
};

module.exports = {
    serviceSearch,
    allServicesSearch
}