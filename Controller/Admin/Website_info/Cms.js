var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

const FAQ = require('../../../Models/Website_info/faq');
const BLOG_COMMENT = require('../../../Models/blog_comments');
const ARTICLES = require('../../../Models/Website_info/articles');

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

var viewAllBlogComments = async (req, res) => {
    let comments = await BLOG_COMMENT.aggregate([
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
            $lookup: {
                from: "blogs",
                localField: "blog_id",
                foreignField: "_id",
                as: "blog_data"
            }
        },
        { $unwind: "$blog_data" },
        { $project: { __v: 0 } }
    ]).exec();

    if (comments.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All comments successfully get.",
            data: comments
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No comments on any blog.",
            data: comments
        });
    }
}

var addArticle = async (req, res) => {
    const V = new Validator(req.body, {
        title: "required",
        details: "required"
    });
    let matched = await V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    if (req.file == "" || req.file == null || typeof req.file == "undefined") {
        return res.status(400).send({
            status: false,
            error: {
                "image": {
                    "message": "The 'image' field is mandatory.",
                    "rule": "required"
                }
            }
        });
    }

    var imageUrl = await Upload.uploadFile(req, "articles");

    let saveData = {
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        details: req.body.details,
        image: imageUrl
    }
    if (req.body.author != "" || req.body.author != null || typeof req.body.author != "undefined") {
        saveData.author = req.body.author;
    }

    const NEW_ARTICLE = new ARTICLES(saveData);

    return NEW_ARTICLE.save()
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data saved successfully.",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Failed to save data. Server error.",
                error: err.message
            });
        });
}

var viewAllArticles = async (req, res) => {
    let articles = await ARTICLES.find({}).exec();

    if (articles.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: articles
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No articles published.",
            data: articles
        });
    }
}

var viewArticleById = async (req, res) => {
    var id = req.params.id;

    return ARTICLES.findOne({ _id: mongoose.Types.ObjectId(id) })
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data successfully get.",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            });
        });
}

var editArticle = async (req, res) => {
    var id = req.params.id;

    const V = new Validator(req.body, {
        title: "required",
        details: "required"
    });
    let matched = await V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    if (req.file == "" || req.file == null || typeof req.file == "undefined") {
        return res.status(400).send({
            status: false,
            error: {
                "image": {
                    "message": "The 'image' field is mandatory.",
                    "rule": "required"
                }
            }
        });
    }

    var imageUrl = await Upload.uploadFile(req, "articles");

    let saveData = {
        title: req.body.title,
        details: req.body.details,
        image: imageUrl
    }
    if (req.body.author != "" || req.body.author != null || typeof req.body.author != "undefined") {
        saveData.author = req.body.author;
    }

    return ARTICLES.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        saveData,
        { new: true }
    )
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data successfully edited.",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            });
        });
}

var deleteArticle = async (req, res) => {
    var id = req.params.id;

    return ARTICLES.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) })
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data successfully deleted.",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err.message
            });
        });
}

module.exports = {
    addFaq,
    imageUpload,
    viewAllFAQs,
    viewFAQById,
    editFAQ,
    deleteFAQ,
    viewAllBlogComments,
    addArticle,
    viewAllArticles,
    viewArticleById,
    editArticle,
    deleteArticle
}