var mongoose = require('mongoose');

var User = require('../../Models/user');
var Seller = require('../../Models/seller');
var sellerBookings = require('../../Models/Slot/seller_bookings');

const viewUserList = async (req, res) => {

    return User.aggregate([


        {
            $lookup: {
                from: "service_carts",
                localField: "_id",
                foreignField: "user_id",
                pipeline: [

                    { $match: { $expr: { $and: [
                         { $eq: ["$refund_claim",false ]} ] } } },

                    { $group: {
                        _id: "$user_id",
                        'total_amount': { $sum:"$price" }
                     }}
                ],      

                as: "user_data_total"


            }


        },
        {
            $unwind:
            {

                path: "$user_data_total",
                preserveNullAndEmptyArrays: true,

            }
        },


        {
            $lookup: {
                from: "service_carts",
                localField: "_id",
                foreignField: "user_id",
                pipeline: [

                    { $match: { $expr: { $and: [
                         { $eq: ["$refund_claim",true ]} ] } } },

                    { $group: {
                        _id: "$user_id",
                        'refunded_amount': { $sum:"$price" }
                     }}
                ],      

                as: "user_data_refunded"


            }


        },
        {
            $unwind:
            {

                path: "$user_data_refunded",
                preserveNullAndEmptyArrays: true,

            }
        },

        {
            $project: {
             _v:0
            }
          },
    ]).then((docs) => {
        res.status(200).json({
          status: true,
          message:"List successfully get.",
          data: docs
        })
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: "Server error. Please try again.",
          error: err
        })
      })


    // return User.find(
    //      { type: { $in: "User" } },
    //     (err, docs) => {
    //         if (err) {
    //             res.status(400).json({
    //                 status: false,
    //                 message: "Server error. Data not available",
    //                 error: err
    //             });
    //         }
    //         else {
    //             res.status(200).json({
    //                 status: true,
    //                 message: "Users get successfully",
    //                 data: docs
    //             });
    //         }
    //     });
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

const Delete = async(req,res)=>{
    return User.remove(
        {_id: { $in : [mongoose.Types.ObjectId(req.params.id)]}})
        .then((data)=>{
            return res.status(200).json({
                status: true,
                message: 'User delete successfully',
                data: data
            });
        })
        .catch((err)=>{
            res.status(500).json({
                status: false,
                message: 'Server error. Please try again.',
                error: error,
            });
        })
    
}

var getSellerRequest = async (req, res) => {
    let requests = await Seller.find({}).exec();

    if (requests.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: requests
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "No pending requests.",
            data: []
        });
    }
}

var approveSellerRequest = async (req, res) => {
    var id = req.params.id;

    return Seller.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { seller_status: true } },
        { new: true }
    )
        .then(data => {
            User.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(data.seller_id) },
                {
                    $set: {
                        type: "Seller",
                        seller_approval: true
                    }
                }
            )
                .then(docs => {
                    res.status(200).json({
                        status: true,
                        message: "Data successfully edited.",
                        data: data
                    });
                })
                .catch(fault => {
                    res.status(500).json({
                        status: false,
                        message: "Invalid id. Server error 2.",
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error 1.",
                error: err
            });
        });
}

var rejectSellerRequest = async (req, res) => {
    var id = req.params.id;

    return Seller.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { ask_permission: false } },
        { new: true }
    )
        .then(data => {
            res.status(200).json({
                status: true,
                message: "Data successfully edited.",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err
            });
        });
}

const viewSellerList = async (req, res) => {

    return User.aggregate([
        {
            $match:
                {
                    type:"Seller"
                }
        },
        {
            $lookup: {
                from: "shop_services",
                localField: "_id",
                foreignField: "user_id",
                as: "seller_service"
            }
        }, 
        {
            $lookup:{

                from: "usersubscriptions",
                let: { user_id: "$_id",status:true },
                pipeline: [{ $match: { $expr: { $and: [
                    { $eq: ["$userid", "$$user_id"] },
                    { $eq: ["$status", "$$status"] },
                ] } } }],
                as: "seller_subscription"
            }
        },
        {
            $unwind:
            {
                path:"$seller_subscription",
                preserveNullAndEmptyArrays: true,
        },
            
        },
    
        {
            $lookup: {
                from: "subscriptions",
                localField: "seller_subscription.subscr_id",
                foreignField: "_id",
                as: "seller_subscription.subcription_data"
            }
        },
        {
            $unwind:"$seller_subscription.subcription_data",
                
        
            
        },

       
      
        {
            $project: {
                __v: 0
            }
        }
   
    ]) .then(data => {
        res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: data
        });
    })
    .catch(err => {
        res.status(500).json({
            status: false,
            message: "Failed to get data. Server error.",
            error: err
        });
    });

    // return User.find(
    //     { type: { $in: "Seller" } },
    //     (err, docs) => {
    //         if (err) {
    //             res.status(400).json({
    //                 status: false,
    //                 message: "Server error. Data not available",
    //                 error: err
    //             });
    //         }
    //         else {
    //             res.status(200).json({
    //                 status: true,
    //                 message: "Sellers get successfully",
    //                 data: docs
    //             });
    //         }
    //     });
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
        { $set: { top_seller: req.body.top_seller } },
        { new: true }
    )
        .then(data => {
            res.status(200).json({
                status: true,
                message: "Data edited successfully.",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: false,
                message: "Invalid id. Server error.",
                error: err
            });
        });
}

var bookingNUserStat = async (req, res) => {
    var findTotalBookings = await sellerBookings.find({}).exec();

    var totalBookingsCount = findTotalBookings.length;

    if (totalBookingsCount > 0) {
        var findAcceptedBookings = await sellerBookings.find({
            new_booking: false,
            booking_accept: true
        }).exec();
        var findRejectedBookings = await sellerBookings.find({
            new_booking: false,
            booking_accept: false
        }).exec();
        var findPendingBookings = await sellerBookings.find({
            new_booking: true,
            booking_accept: false,
        }).exec();
        var findUsers = await User.find({ type: "User" }).exec();
        var findSellers = await User.find({ type: "Seller" }).exec();

        var acceptedBookingsCount = findAcceptedBookings.length;
        var rejectedBookingsCount = findRejectedBookings.length;
        var pendingBookingsCount = findPendingBookings.length;
        var userCount = findUsers.length;
        var sellerCount = findSellers.length;

        return res.status(200).json({
            status: true,
            message: "All booking stats successfully get.",
            total_bookings: totalBookingsCount,
            accepted_bookings: acceptedBookingsCount,
            rejected_bookings: rejectedBookingsCount,
            pending_bookings: pendingBookingsCount,
            user_count: userCount,
            seller_count: sellerCount
        });
    }
    else {
        return res.status(500).json({
            status: false,
            message: "This seller hasn't received any service booking.",
            total_bookings: 0,
            accepted_bookings: 0,
            rejected_bookings: 0,
            pending_bookings: 0,
            user_count: 0,
            seller_count: 0
        });
    }
}

module.exports = {
    viewUserList,
    viewUser,
    getSellerRequest,
    approveSellerRequest,
    rejectSellerRequest,
    viewSellerList,
    viewSeller,
    selectTopSeller,
    bookingNUserStat,
    Delete
}