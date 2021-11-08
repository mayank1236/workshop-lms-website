const CAREERS = require('../../../Models/Website_info/careers');

var viewAllPostedJobs = async (req, res) => {
    var posted_jobs = await CAREERS.find().exec();

    if (posted_jobs.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: posted_jobs
        });
    }
    else {
        return res.status(500).json({
            status: false,
            error: "Failed to get data. Server error.",
            data: null
        });
    }
}

var viewPostedJobById = async (req, res) => {
    var id = req.params.id;

    return CAREERS.findById(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Info successfully get.",
                    data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Invalid id.",
                    error: err
                });
            }
        }
    );
}

module.exports = {
    viewAllPostedJobs,
    viewPostedJobById
}