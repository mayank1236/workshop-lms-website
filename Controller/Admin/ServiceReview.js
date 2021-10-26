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

module.exports = {
    getReviews
}