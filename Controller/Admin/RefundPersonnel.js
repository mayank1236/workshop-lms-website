var mongoose = require('mongoose')
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');

var Upload=require('../../service/upload');
// const { Validator } = require('node-input-validator');

const ADMIN = require('../../Models/admin');

function createToken(data) {
    return jwt.sign(data, 'DonateSmile');
}

const register = async (req, res) => {
    // if (req.file == "" || req.file == null || typeof req.file == "undefined") {
    //     return res.status(400).send({
    //         status: false,
    //         error: {
    //             "image": {
    //                 "message": "The image field is mandatory.",
    //                 "rule": "required"
    //             }
    //         }
    //     });
    // }

    // let imageUrl = await Upload.uploadFile(req, "refund_personnel");
// console.log(req.body);
    let adminData = {
        _id: mongoose.Types.ObjectId(),
        fullname: req.body.fullname,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        admin_type: req.body.admin_type,
        token: createToken(req.body)
    }

  

    // if(req.body.mobile!=null||req.body.mobile != '' || typeof (req.body.mobile) != "undefined"){
    //     adminData.mobile=req.body.mobile;
    // }

    // if(req.body.address!=null||req.body.address != '' || typeof (req.body.address) != "undefined"){
    //     adminData.address=req.body.address;
    // }

    // if (req.file != null || req.file != '' || typeof (req.file) != "undefined") {
    //     let imageUrl = await Upload.uploadFile(req, 'admin')
    //     adminData.image = imageUrl;

    // }


    //image: imageUrl,

    const NEW_REFUND_PERSONNEL = new ADMIN(adminData)

    return NEW_REFUND_PERSONNEL.save().then((data) => {
        res.status(200).json({
            status: true,
            success: true,
            message: 'New refund personnel created successfully',
            data: data,
        })
    })
        .catch((error) => {
            res.status(200).json({
                status: false,
                success: false,
                message: 'Server error. Please try again.',
                error: error.message,
            });
        })
}

var refundPersonnelList = async (req, res) => {
    let refundPersonnel = await ADMIN.find(
        {
            status: true,
            admin_type: "Refund_personnel"
        }).exec();

    if (refundPersonnel.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: refundPersonnel
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "Currently no active personnel exists.",
            data: []
        });
    }
}



var setStatus = async (req,res) => {
    var id = req.params.id;

    return ADMIN.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) }, 
        { $set: { status: false } }, 
        { new: true }
        )
        .then(data => {
            res.status(200).json({
                status: true,
                message: "Personnel made inactive",
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

module.exports = {
    register,
    refundPersonnelList,
    setStatus,
    
}