var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

const BLOG_COMMENT = require('../../Models/blog_comments');

var Upload = require('../../service/upload');

var addComment = async (req, res) => {
    const V = new Validator(req.body, {
        blog_type: 'required',
        name: 'required',
        email: 'required|email',
        message: 'required',
    });
    let matched = await V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors })
    }

    let saveData = {
        _id: mongoose.Types.ObjectId(),
        blog_id: mongoose.Types.ObjectId(req.body.blog_id),
        blog_type: req.body.blog_type,
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }
    if (req.body.image != "" || req.body.image != null || typeof req.body.image != "undefined") {
        saveData.image = req.body.image;
    }

    const NEW_COMMENT = new BLOG_COMMENT(saveData);

    return NEW_COMMENT.save()
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Comment added successfully",
                data: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Failed to add data. Server error.",
                error: err.message
            });
        });
}

var uploadImage = async (req, res) => {
    var imageUrl = "";
    var image_url = await Upload.uploadFile(req, "blog_comments");

    if (req.file != "" || req.file != null || typeof req.file != "undefined") {
        imageUrl = image_url;
    }

    return res.status(200).send({
        status: true,
        data: imageUrl,
        error: null
    });
}

var getAllComments = async (req, res) => {
    let comments = await BLOG_COMMENT.find({}).exec();

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
            message: "No comments added.",
            data: comments
        });
    }
}

var getCommentById = async (req, res) => {
    var id = req.params.id;

    return BLOG_COMMENT.findOne({ _id: mongoose.Types.ObjectId(id) })
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Comment successfully get.",
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

var editComment = async (req, res) => {
    var id = req.params.id;

    const V = new Validator(req.body, {
        blog_type: 'required',
        name: 'required',
        email: 'required|email',
        message: 'required',
    });
    let matched = await V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors })
    }

    return BLOG_COMMENT.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        req.body,
        { new: true }
    )
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data edited successfully",
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

var delBlogComment = async (req, res) => {
    var id = req.params.id;

    return BLOG_COMMENT.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) })
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data deleted successfully",
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
    addComment,
    uploadImage,
    getAllComments,
    getCommentById,
    editComment,
    delBlogComment
}