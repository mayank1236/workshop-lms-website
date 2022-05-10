var mongoose = require('mongoose');

var serviceReview = require('../../Models/service_review');

var getReviews = async (req, res) => {
    return serviceReview.aggregate(
        [
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_data"
                }
            },
            { $unwind: "$user_data" },
            {
                $lookup:{
                    from:"shop_services",
                    localField:"service_id",
                    foreignField:"_id",
                    as :"service_data"
                }
            },
            {
                $project: {
                    __v: 0
                }
            }
        ]
    )
        .then(data => {
            if (data.length > 0) {
                res.status(200).json({
                    status: true,
                    message: "Reviews get successfully",
                    data: data
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "No reviews for this service.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "No match.",
                error: err
            });
        });
};


const update = async(req,res)=>{
    return serviceReview.findOneAndUpdate(
        { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
        req.body,
        async (err, data) => {
          if (err) {
            res.status(500).json({
              status: false,
              message: "Server error. Please try again.",
              error: err,
            });
          } else if (data != null) {
            data = { ...req.body, ...data._doc };
            res.status(200).json({
              status: true,
              message: "Review update successful",
              data: data,
            });
          } else {
            res.status(500).json({
              status: false,
              message: "User not match",
              data: null,
            });
          }
        }
      );
    };

module.exports = {
    getReviews,
    update
}