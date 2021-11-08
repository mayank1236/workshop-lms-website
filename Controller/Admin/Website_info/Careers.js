var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

const CAREERS = require('../../../Models/Website_info/careers');

var addJobPost = async (req, res) => {
    const V = new Validator(req.body, {
        title: 'required',
        description: 'required',
        experience: 'required'
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    let jobData = {
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        experience: req.body.experience
    }
    if (
        req.body.vacancy != '' ||
        req.body.vacancy != null ||
        typeof req.body.vacancy != "undefined"
    ) {
        jobData.vacancy = req.body.vacancy;
    }
    if (
        req.body.urgent != '' ||
        req.body.urgent != null ||
        typeof req.body.urgent != "undefined"
    ) {
        jobData.urgent = req.body.urgent;
    }

    const NEW_JOB = new CAREERS(jobData);

    return NEW_JOB.save((err, docs) => {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "Data added successfully.",
                data: docs
            });
        }
        else {
            res.status(500).json({
                status: false,
                message: "Failed to add data. Server error.",
                error: err
            });
        }
    });
}

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

var editPostedJob = async (req, res) => {
    const V = new Validator(req.body, {
        title: 'required',
        description: 'required',
        experience: 'required'
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    var id = req.params.id;

    return CAREERS.findByIdAndUpdate(
        { _id: id },
        req.body,
        { new: true },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Info updated successfully!",
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

var deletePostedJob = async (req, res) => {
    var id = req.params.id;

    return CAREERS.findByIdAndDelete(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Info successfully deleted.",
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
    addJobPost,
    viewAllPostedJobs,
    viewPostedJobById,
    editPostedJob,
    deletePostedJob
}