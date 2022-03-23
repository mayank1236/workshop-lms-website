var mongoose = require('mongoose');

const FAQ = require('../../../Models/Website_info/faq');
const ARTICLES = require('../../../Models/Website_info/articles');
const TESTIMONIALS = require('../../../Models/Website_info/testimonials');

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

var viewAllTestimonials = async (req, res) => {
    let testimonials = await TESTIMONIALS.find({}).exec();

    if (testimonials.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: testimonials
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No testimonials.",
            data: testimonials
        });
    }
}

var viewTestimonialById = async (req, res) => {
    var id = req.params.id;

    return TESTIMONIALS.findOne({ _id: mongoose.Types.ObjectId(id) })
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

module.exports = {
    viewAllFAQs,
    viewFAQById,
    viewAllArticles,
    viewArticleById,
    viewAllTestimonials,
    viewTestimonialById
}