var mongoose = require('mongoose');

const User = require("../../Models/user");

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

const viewUser = async (req, res) => {
    let id = req.params.id;
    return User.findOne(
        { _id: { $in: [mongoose.Types.ObjectId(id)] } },
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
                    message: "User get successfully",
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
                res.status(400).json({
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

const viewSeller = async (req, res) => {
    let id = req.params.id;
    return User.findOne(
        { _id: { $in: [mongoose.Types.ObjectId(id)] } },
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
                    message: "Seller get successfully",
                    data: docs
                });
            }
        });
}

var selectTopSeller = async (req, res) => {
    var id = req.params.id;

    return User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { top_seller: true } },
        { new: true }
    )
        .then(data=>{
            res.status(200).json({
                status: true,
                message: "Data edited successfully.",
                data: data
            });
        })
        .catch(err=>{
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err
            });
        });
}

var userNSellerCount = async (req,res)=>{
    var findUsers = await User.find({type: "User"}).exec();
    var userCount = findUsers.length;
    var findSellers = await User.find({type: "Seller"}).exec();
    var sellerCount = findSellers.length;

    if (userCount && sellerCount > 0) {
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            user_count: userCount,
            seller_count: sellerCount
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No user and seller registered yet",
            user_count: 0,
            seller_count: 0
        });
    }
}

module.exports = {
    viewUserList,
    viewUser,
    viewSellerList,
    viewSeller,
    selectTopSeller,
    userNSellerCount
}