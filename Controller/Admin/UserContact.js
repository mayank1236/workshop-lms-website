const USER_CONTACT = require('../../Models/user_contact');

var getAllContacts = async (req,res) => {
    let contacts = await USER_CONTACT.find({}).exec();

    if (contacts.length > 0) {
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: contacts
        });
    }
    else {
        return res.status(200).json({
            status: true,
            message: "Data successfully get.",
            data: contacts
        });
    }
}

module.exports = {
    getAllContacts
}