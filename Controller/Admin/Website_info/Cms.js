var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

const FAQ = require('../../../Models/Website_info/faq');

var Upload = require('../../../service/upload');

var addFaq = async (req, res) => {
    const V = new Validator(req.body, {
        question: 'required',
        answer: 'required',
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    let faqData = {
        question: req.body.question,
        answer: req.body.answer,
    }
    if (
        req.body.image != "" ||
        req.body.image != null ||
        typeof req.body.image != "undefined"
    ) {
        faqData.image = req.body.image;
    }
    if (
        req.body.audio != "" ||
        req.body.audio != null ||
        typeof req.body.audio != "undefined"
    ) {
        faqData.audio = req.body.audio;
    }

    const NEW_FAQ = new FAQ(faqData);

    return NEW_FAQ.save((err, docs) => {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "New faq added successfully!",
                data: docs
            });
        }
        else {
            res.status(500).json({
                status: false,
                message: "Failed to add faq. Server error.",
                error: err.message
            });
        }
    });
}

var imageUpload = async (req, res) => {
    let imagUrl = "";
    let image_url = await Upload.uploadFile(req, "faq");
    if (
        req.file != "" ||
        req.file != null ||
        typeof req.file != "undefined"
    ) {
        imagUrl = image_url
    }

    return res.status(200).send({
        status: true,
        data: imagUrl,
        error: null
    });
}

var viewAllFAQs = async (req, res) => {
    var faqs = await FAQ.find().exec();

    if (faqs.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All FAQs successfully get.",
            data: faqs
        });
    }
    else {
        return res.status(500).json({
            status: false,
            message: "Failed to get segments. Server error."
        });
    }
}

var viewFAQById = async (req, res) => {
    var id = req.params.id;

    var faq = await FAQ.findById({ _id: id }).exec();

    if (faq != "" || faq != null) {
        return res.status(200).json({
            status: true,
            message: "FAQ successfully get.",
            data: faq
        });
    }
    else {
        return res.status(500).json({
            status: false,
            message: "Invalid id.",
            error: err.message
        });
    }
}

var editFAQ = async (req, res) => {
    const V = new Validator(req.body, {
        question: 'required',
        answer: 'required',
        question_two: 'required',
        answer_two: 'required'

    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    var id = req.params.id;

    return FAQ.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        req.body,
        { new: true },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "FAQ successfully edited.",
                    data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Invalid id.",
                    error: err.message
                });
            }
        }
    );
}

var deleteFAQ = async (req, res) => {
    var id = req.params.id;

    return FAQ.findByIdAndDelete(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Partner info deleted successfully.",
                    data: docs
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: "Invalid id.",
                    error: err.message
                });
            }
        });
}

module.exports = {
    addFaq,
    imageUpload,
    viewAllFAQs,
    viewFAQById,
    editFAQ,
    deleteFAQ
}