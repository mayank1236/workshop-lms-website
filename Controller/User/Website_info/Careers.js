var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

const CAREERS = require('../../../Models/Website_info/careers');
const JOB_APPLICATION = require('../../../Models/job_applications');
var Upload = require('../../../service/upload');

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

// user apply for job
var applyToJob = async (req, res) => {
    const V = new Validator(req.body, {
        firstName: 'required',
        lastName: 'required',
        email: 'required|email',
        contact: 'required',
        cv: 'required'
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }
    var cv_url = await Upload.uploadFile2(req, "cv");

    var job = await CAREERS.findOne({_id: mongoose.Types.ObjectId(req.body.job_id)}).exec();

    console.log("Posted job status: ", job.status);

    if (job && job.status === true) {
        var checkApplication = await JOB_APPLICATION.find({
            job_id: mongoose.Types.ObjectId(req.body.job_id),
            email: req.body.email
        }).exec();

        console.log("No. of previous applications: ", checkApplication.length);

        if (checkApplication.length > 0) {
            return res.status(500).json({
                status: false,
                error: "Already applied for this job.",
                data: null
            });
        }
        else {
            let applicationData = {
                _id: mongoose.Types.ObjectId(),
                job_id: mongoose.Types.ObjectId(req.body.job_id),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                contact: Number(req.body.contact),
                cv: cv_url
            }

            const NEW_APPLICATION = new JOB_APPLICATION(applicationData);

            return NEW_APPLICATION.save((err,docs)=>{
                if (!err) {
                    res.status(200).json({
                        status: true,
                        message: "Data added successfully!",
                        data: docs
                    });
                }
                else {
                    res.status(500).json({
                        status: false,
                        message: "Failed to add data. Server error.",
                        error: err.message
                    });
                }
            });
        }
    }
    else {
        return res.status(500).json({
            status: false,
            error: "Application is closed for this job.",
            data: null
        });
    }
}

module.exports = {
    viewAllPostedJobs,
    viewPostedJobById,
    applyToJob
}