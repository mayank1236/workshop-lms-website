var mongoose = require('mongoose');
const FEEDBACK_MODEL = require('../../Models/feedback');

var viewAllFeedback = async (req, res) => {
    return FEEDBACK_MODEL.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            password: 0,
                            token: 0
                        }
                    }
                ],
                as: "user_data"
            }
        },
        {
            $project: {
                __v: 0
            }
        }
    ])
        .then(data => {
            res.status(200).json({
                status: true,
                message: "Data successfully get.",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Failed to get data. Server error.",
                error: err
            });
        });
}

var viewFeedbackById = async (req, res) => {
    var id = req.params.id;

    return FEEDBACK_MODEL.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            password: 0,
                            token: 0
                        }
                    }
                ],
                as: "user_data"
            }
        },
        {
            $project: {
                __v: 0
            }
        }
    ])
        .then(data => {
            res.status(200).json({
                status: true,
                message: "Data successfully get.",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Failed to get data. Server error.",
                error: err
            });
        });
}

module.exports = {
    viewAllFeedback,
    viewFeedbackById
}