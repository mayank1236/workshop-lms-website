const BLOG = require('../../Models/blog');

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

module.exports = {
    viewAllBlogs,
    viewBlogById
}