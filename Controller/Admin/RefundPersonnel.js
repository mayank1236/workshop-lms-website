var mongoose = require('mongoose')
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
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

    let adminData = {
        _id: mongoose.Types.ObjectId(),
        fullname: req.body.fullname,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        admin_type: req.body.admin_type,
        token: createToken(req.body)
    }
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

module.exports = {
    register
}