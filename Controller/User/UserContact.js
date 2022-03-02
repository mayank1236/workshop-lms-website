const { Validator } = require('node-input-validator');

const USER_CONTACT = require('../../Models/user_contact');

var Upload = require('../../service/upload');

var makeContact = async (req, res) => {
    const V = new Validator(req.body, {
        firstname: 'required',
        lastname: 'required',
        user_email: 'required|email',
        reason: 'required',
        message: 'required'
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

    if (req.file != "" || req.file != null || typeof req.file != "undefined") {
        let fileUrl = await Upload.uploadFile2(req, "contacted_users");
        req.body.file = fileUrl;
    }

    const NEW_USER_CONTACT = new USER_CONTACT(req.body);

    return NEW_USER_CONTACT.save()
        .then(docs => {
            res.status(200).json({
                status: true,
                message: "Data successfully saved.",
                data: docs
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

module.exports = {
    makeContact
}