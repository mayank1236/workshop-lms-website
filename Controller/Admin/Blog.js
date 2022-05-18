var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');

const BLOG = require('../../Models/blog');
const HOMEBANNER = require('../../Models/homebanner');
const ABOUTBANNER = require('../../Models/aboutbanner');


var Upload = require('../../service/upload');

var addBlog = async (req, res) => {
    const V = new Validator(req.body, {
        title: 'required',
        content: 'required',
        author: 'required',
        image: 'required',
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    let blogData = {
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content,
        image: req.body.image
    }
    if (
        req.body.author != "" || 
        req.body.author != null || 
        typeof req.body.author != "undefined"
    ) {
        blogData.author = req.body.author;
    }
    if (
        req.body.audio != "" ||
        req.body.audio != null ||
        typeof req.body.audio != "undefined"
    ) {
        blogData.audio = req.body.audio;
    }
    if (
        req.body.blog_type != "" ||
        req.body.blog_type != null ||
        typeof req.body.blog_type != "undefined"
    ) {
        blogData.blog_type = req.body.blog_type;
    }

    const NEW_BLOG = new BLOG(blogData);

    return NEW_BLOG.save((err, docs) => {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "New blog added successfully!",
                data: docs
            });
        }
        else {
            res.status(500).json({
                status: false,
                message: "Failed to add blog. Server error.",
                error: err
            });
        }
    });
}

var imageUpload = async (req, res) => {
    let imagUrl = "";
    let image_url = await Upload.uploadFile(req, "blog");
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

var viewAllBlogs = async (req, res) => {
    var blogs = await BLOG.find().exec();

    if (blogs.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All blogs successfully get.",
            data: blogs
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No contact information to show.",
            data: null
        });
    }
}

var viewBlogById = async (req, res) => {
    var id = req.params.id;

    return BLOG.findById(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Blog successfully get.",
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

var editBlog = async (req, res) => {
    const V = new Validator(req.body, {
        title: 'required',
        content: 'required',
        author: 'required',
        image: 'required',
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    var id = req.params.id;

    return BLOG.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        req.body,
        { new: true },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Blog successfully edited.",
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

var deleteBlog = async (req, res) => {
    var id = req.params.id;

    return BLOG.findByIdAndDelete(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Blog deleted successfully.",
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

var addhomeBanner = async (req, res) => {
    const V = new Validator(req.body, {
        heading: 'required',
        content: 'required',
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    let blogData = {
        _id: mongoose.Types.ObjectId(),
        heading: req.body.heading,
        content: req.body.content
    }

    const NEW_BLOG = new HOMEBANNER(blogData);

    return NEW_BLOG.save((err, docs) => {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "New Banner Content added successfully!",
                data: docs
            });
        }
        else {
            res.status(500).json({
                status: false,
                message: "Failed to add. Server error.",
                error: err
            });
        }
    });
}

var editBanner = async (req, res) => {
    const V = new Validator(req.body, {
        heading: 'required',
        content: 'required',
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    var id = req.params.id;

    return HOMEBANNER.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        req.body,
        { new: true },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Banner Content successfully edited.",
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

var viewAllBAnner = async (req, res) => {
    var blogs = await HOMEBANNER.find().exec();

    if (blogs.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All blogs successfully get.",
            data: blogs
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No contact information to show.",
            data: null
        });
    }
}


var addaboutBanner = async (req, res) => {
    const V = new Validator(req.body, {
        heading1: 'required',
        heading2: 'required',
        content1: 'required',
        content2: 'required',
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    let blogData = {
        _id: mongoose.Types.ObjectId(),
        heading1: req.body.heading1,
        heading2: req.body.heading2,
        content1: req.body.content1,
        content2: req.body.content2,
    }

    const NEW_BLOG = new ABOUTBANNER(blogData);

    return NEW_BLOG.save((err, docs) => {
        if (!err) {
            res.status(200).json({
                status: true,
                message: "New Banner Content added successfully!",
                data: docs
            });
        }
        else {
            res.status(500).json({
                status: false,
                message: "Failed to add. Server error.",
                error: err
            });
        }
    });
}

var editaboutBanner = async (req, res) => {
    const V = new Validator(req.body, {
        heading1: 'required',
        heading2: 'required',
        content1: 'required',
        content2: 'required',
    });
    let matched = V.check().then(val => val);

    if (!matched) {
        return res.status(400).json({ status: false, errors: V.errors });
    }

    var id = req.params.id;

    return ABOUTBANNER.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        req.body,
        { new: true },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Banner Content successfully edited.",
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

var viewAllaboutBAnner = async (req, res) => {
    var blogs = await ABOUTBANNER.find().exec();

    if (blogs.length > 0) {
        return res.status(200).json({
            status: true,
            message: "All blogs successfully get.",
            data: blogs
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No contact information to show.",
            data: null
        });
    }
}

module.exports = {
    addBlog,
    imageUpload,
    viewAllBlogs,
    viewBlogById,
    editBlog,
    deleteBlog,
    addhomeBanner,
    viewAllBAnner,
    editBanner,
    viewAllaboutBAnner,
    editaboutBanner,
    addaboutBanner
}