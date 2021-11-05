const LEGAL_NOTICE = require('../../../Models/Website_info/legal_notice');

var viewAllSegments = async (req, res) => {
    var LEGAL_NOTICEInfo = await LEGAL_NOTICE.find().exec();

    if (LEGAL_NOTICEInfo.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data get successfully!",
            data: LEGAL_NOTICEInfo
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

    return LEGAL_NOTICE.findById(
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