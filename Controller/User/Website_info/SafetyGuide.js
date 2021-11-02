const SAFETY_GUIDE = require('../../../Models/Website_info/safety_guide');

var viewAllSegments = async (req, res) => {
    var safetyGuideInfo = await SAFETY_GUIDE.find().exec();

    if (safetyGuideInfo.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: safetyGuideInfo
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

var viewSegmentById = async (req, res) => {
    var id = req.params.id;

    return SAFETY_GUIDE.findById(
        { _id: id },
        (err, docs) => {
            if (!err) {
                res.status(200).json({
                    status: true,
                    message: "Segment successfully get.",
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
    viewAllSegments,
    viewSegmentById
}