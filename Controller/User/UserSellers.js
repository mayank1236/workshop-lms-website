var mongoose = require('mongoose');
const { Validator } = require('node-input-validator');
// const { stringify } = require('uuid');

var User = require("../../Models/user");
var Shop = require("../../Models/shop");
const SELLER = require("../../Models/seller");

var Upload = require("../../service/upload");

const sellerLogin = async (req, res) => {
    const v = new Validator(req.body, {
        email: "required",
        password: "required|minLength:8"
    })
    let matched = await v.check().then(val => val)
    if (!matched) {
        return res.status(400).json({ status: false, error: v.errors })
    }

    User.findOne({
        email: req.body.email,
        type: "Seller"
    }).then(user => {
        if (user != null && user != '' && user.length < 1) {
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                error: "Invalid id."
            })
        }
        else if (user != null && user != '' && user.comparePassword(req.body.password)) {
            res.status(200).json({
                status: true,
                message: "Login successfull!",
                data: user
            })
        }
        else {
            res.status(500).json({
                status: false,
                message: "Server error2. Please try again.",
                error: "Not authorized seller."
            })
        }
    }).catch(err => {
        res.status(401).json({
            status: false,
            message: "Server error3. Please try again.",
            error: err
        })
    })
}

const sellerTokenCheck = async (req, res) => {
    User.findOne({ token: req.params.token })
        .then(data => {
            if (data != null && data != '' && data.type == 'Seller') {
                res.status(200).json({
                    status: true,
                    message: "Seller successfully found.",
                    data: data
                })
            }
            else {
                res.status(400).json({
                    status: false,
                    message: "User not authorized as seller.",
                    error: "User not authorized."
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Server error. Seller not authorized.",
                error: err
            })
        })
}

const viewUser = async (req, res) => {
    let id = req.params.id;
    User.findOne(
        { _id: { $in: [mongoose.Types.ObjectId(id)] } },
        async (err, docs) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    message: "Server error. Data not available",
                    error: err
                });
            }
            else {
                // console.log("user", docs);
                // console.log("shop", data);
                Shop.find({ userid: { $in: [mongoose.Types.ObjectId(id)] } })
                    .then((data) => {
                        if (data == null || data == '') {
                            res.status(200).json({
                                status: true,
                                message: "User successfully get. User doesn't have a shop",
                                data: docs,
                                shop_id: []
                            })
                        }
                        else {
                            console.log("Shop", data)
                            let seller = docs;
                            console.log("Seller", seller)
                            let shop = data[0]
                            seller.shop_id = shop._id
                            res.status(200).json({
                                status: true,
                                message: "User and shop id successfully get",
                                data: seller,
                                shop_id: seller.shop_id
                            })
                        }
                    })
                    .catch((err) => {
                        res.status(200).json({
                            status: false,
                            message: "Server error. Please try again later",
                            error: err
                        })
                    })

            }
        });
}

const viewUserList = async (req, res) => {
    return User.find(
        { type: { $in: "User" } },
        (err, docs) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "Server error. Data not available",
                    error: err
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "Users get successfully",
                    data: docs
                });
            }
        });
}

const viewSellerList = async (req, res) => {
    return User.find(
        { type: { $in: "Seller" } },
        (err, docs) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    message: "Server error. Data not available",
                    error: err
                });
            }
            else {
                res.status(200).json({
                    status: true,
                    message: "Sellers get successfully",
                    data: docs
                });
            }
        });
}

var viewTopSellers = async (req, res) => {
    return User.find(
        {
            type: "Seller",
            top_seller: true
        }
    )
        .then(data => {
            res.status(200).json({
                status: true,
                message: "Data get successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Server error. Data not available",
                error: err
            });
        });
}

var applyForSeller = async (req, res) => {
    var adminCheck = await SELLER.findOne({ seller_id: mongoose.Types.ObjectId(req.body.seller_id) }).exec();
    console.log(adminCheck);

    if (adminCheck == null || adminCheck == "") {
        const V = new Validator(req.body, {
            name: 'required',
            address: 'required',
            email: 'required|email',
            phone: 'required',
            govt_id_name: 'required',
            govt_id: 'required'
        });
        let matched = await V.check().then(val => val);

        if (!matched) {
            return res.status(400).json({ status: false, errors: V.errors });
        }

        if (req.file == "" || req.file == null || typeof req.file == "undefined") {
            return res.status(400).send({
                status: false,
                error: {
                    "image": {
                        "message": "The image field is mandatory.",
                        "rule": "required"
                    }
                }
            });
        }

        var image_url = await Upload.uploadFile(req, "sellers");

        let saveData = {
            _id: mongoose.Types.ObjectId(),
            seller_id: mongoose.Types.ObjectId(req.body.seller_id),
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            govt_id_name: req.body.govt_id_name,
            govt_id: req.body.govt_id,
            image: image_url
        }
        // if (req.body.country != "" || req.body.country != null || typeof req.body.country != "undefined") {
        //   saveData.country = JSON.parse(req.body.country);
        // }
        if (req.body.currency != "" || req.body.currency != null || typeof req.body.currency != "undefined") {
            saveData.currency = req.body.currency;
        }

        const NEW_SELLER = new SELLER(saveData);
        NEW_SELLER.save()
            .then(data => {
                User.findOneAndUpdate(   // var editUserType = await
                    { _id: mongoose.Types.ObjectId(data.seller_id) },
                    { $set: { seller_request: true } }
                )
                    .then(docs => {
                        res.status(200).json({
                            status: true,
                            message: "Successfully applied.",
                            data: data
                        });
                    })
                    .catch(fault => {
                        res.status(500).json({
                            status: false,
                            message: "Invalid id. Server error.",
                            error: fault.message
                        });
                    });
            })
            .catch(err => {
                res.status(500).json({
                    status: false,
                    message: "Failed to save data. Server error.",
                    error: err.message
                });
            });
    }
    else {
        return res.status(500).json({
            status: false,
            data: null,
            error: "Seller approval request already sent."
        });
    }
}

var getSellerApprovalStatus = async (req, res) => {
    var id = req.params.id;

    return User.findOne({ _id: mongoose.Types.ObjectId(id) })
        .then(data => {
            res.status(200).json({
                status: true,
                message: "Data successfully get.",
                data: data
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
    sellerLogin,
    sellerTokenCheck,
    viewUser,
    viewUserList,
    viewSellerList,
    viewTopSellers,
    applyForSeller,
    getSellerApprovalStatus
}