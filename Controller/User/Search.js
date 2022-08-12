var mongoose = require('mongoose');
var serviceCategory = require('../../Models/service_category');
var shopService = require('../../Models/shop_service');
var serviceReview = require('../../Models/service_review');

var serviceSearch = async (req, res) => {
  return shopService.aggregate([
    req.body.servicename != "" && typeof req.body.servicename != "undefined"
      ? {
        $match: {
          name: {
            $in: [req.body.servicename.toString()]
            // $options: "$i"
          }
        },
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

var Search = async (req, res) => {
  // shopService.find({ $text: { $search: req.body.categoryname }},
  //   { score: {$meta: "textScore"} }
  // )
  return shopService.aggregate(
    [

    {
        $match: {
          $expr: {
            $text: req.body.categoryname,
            // $options: "$i"
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "seller_data"
        }
      },
      { $unwind: "$seller_data" },
      {
        $project: {
          __v: 0
        }
      }
    ]
  )
    .sort({ score: { $meta: "textScore" } })
    .then(data => {
      if (data == null || data == "") {
        res.status(200).json({
          status: true,
          message: "No result for this search.",
          data: data
        })
      }
      else {
        res.status(200).json({
          status: true,
          message: "All related shop services",
          data: data
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        status: false,
        message: "Server error. Please try again.",
        error: err
      });
    });
};

var allSearch = async (req, res) => {
  var servArr = [];

  let Service = await shopService.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { name: { $regex: ".*" + req.body.searchname + ".*", $options: "i" } },
              { category_name: { $regex: ".*" + req.body.searchname + ".*", $options: "i" } }
            ]
          },
          { status: true }
        ]
      },
    },
  ]).exec();
  Service.forEach(element => {
    servArr.push(element);
  });

  console.log("Search results", servArr);

  if (servArr.length > 0) {
    return res.status(200).json({
      status: true,
      message: "Data successfully get",
      data: servArr
    });
  }
  else {
    return res.status(200).json({
      status: true,
      message: "No match.",
      data: servArr
    });
  }
};

module.exports = {
  serviceSearch,
  Search,
  allSearch,
}