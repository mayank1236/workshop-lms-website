var mongoose = require('mongoose');

const SELLER_CHAT_REVIEW = require('../../Models/seller_chat_review');

var Upload = require('../../service/upload');

var addChatReview = async (req, res) => {
    let adminCheck = await SELLER_CHAT_REVIEW.findOne({
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        seller_id: mongoose.Types.ObjectId(req.body.seller_id)
    }).exec();
    console.log(adminCheck);

    if (adminCheck != null) {
        return res.status(500).json({
            status: false,
            error: "You have already reviewed this service provider.",
            data: null
        });
    }
    else {
        let saveData = {
            _id: mongoose.Types.ObjectId(),
            user_id: mongoose.Types.ObjectId(req.body.user_id),
            seller_id: mongoose.Types.ObjectId(req.body.seller_id),
            rating: req.body.rating
        }
        if (req.body.comment != "" || req.body.comment != null || typeof req.body.comment != "undefined") {
            saveData.comment = req.body.comment;
        }
        if (req.body.tip != "" || req.body.tip != null || typeof req.body.tip != "undefined") {
            saveData.tip = req.body.tip;
        }
        if (req.body.currency != "" || req.body.currency != null || typeof req.body.currency != "undefined") {
            saveData.currency = req.body.currency;
        }
        if (req.body.image != "" || req.body.image != null || typeof req.body.image != "undefined") {
            saveData.image = req.body.image;
        }

        const NEW_CHAT_REVIEW = new SELLER_CHAT_REVIEW(saveData);

        return NEW_CHAT_REVIEW.save()
            .then(docs => {
                res.status(200).json({
                    status: true,
                    message: "Review added successfully.",
                    data: docs
                });
            })
            .catch(err => {
                res.status(500).json({
                    status: false,
                    message: "Rating is required.",
                    error: err.message
                });
            });
    }
}

var chatImageUrl = async (req, res) => {
    let imagUrl = '';
    let image_url = await Upload.uploadFile(req, "chat_reviews");
    if (typeof (req.file) != 'undefined' || req.file != '' || req.file != null) {
        imagUrl = image_url;
    }

    return res.status(200).send({
        status: true,
        data: imagUrl,
        error: null
    });
}

var getChatReview = async (req, res) => {
    let review = await SELLER_CHAT_REVIEW.find({
        user_id: req.body.user_id,
        seller_id: req.body.seller_id
    }).exec();

    if (review.length > 0) {
        res.status(200).json({
            status: true,
            message: "Review data get successfully.",
            data: review
        });
    }
    else {
        res.status(200).json({
            status: true,
            message: "Not previously reviewed.",
            data: review
        });
    }
}

module.exports = {
    addChatReview,
    chatImageUrl,
    getChatReview
}