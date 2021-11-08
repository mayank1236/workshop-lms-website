var mongoose = require('mongoose');

const JOB_APPLICATION = require('../../Models/job_applications');

var viewAll = async (req, res) => {
    return JOB_APPLICATION.aggregate([
        {
            $lookup: {
                from: "careers",
                localField: "job_id",
                foreignField: "_id",
                as: "applied_for"
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
                error: err.message
            });
        });
}

var viewById = async (req, res) => {
    var id = req.params.id;

    return JOB_APPLICATION.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "careers",
                localField: "job_id",
                foreignField: "_id",
                as: "applied_for"
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
    viewAll,
    viewById
}