var contactUsInfo = require('../../../Models/Website_info/contact_us');

var viewAll = async (req, res) => {
    var contact_us_info = await contactUsInfo.find().exec();

    if (contact_us_info.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: contact_us_info
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

var viewById = async (req, res) => {
    var id = req.params.id;

    return contactUsInfo.findById(
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
    viewAll,
    viewById
}