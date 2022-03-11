const FAQ = require('../../../Models/Website_info/faq');

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

module.exports = {
    viewAllFAQs,
    viewFAQById
}