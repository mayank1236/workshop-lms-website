const ASSOCIATE = require('../../../Models/Website_info/associates');

var viewAllAssociates = async (req, res) => {
    var associates = await ASSOCIATE.find().exec();

    if (associates.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: associates
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

var viewAssociateById = async (req, res) => {
    var id = req.params.id;

    return ASSOCIATE.findById(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Data successfully get.",
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
    viewAllAssociates,
    viewAssociateById
}