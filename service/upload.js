var fs = require("fs");

const uploadFile = async (req, folder) => {
    let file_name = "uploads/"+folder+"/image_"+req.file.originalname;
    fs.writeFileSync(file_name, req.file.buffer);
    return file_name;
}

const uploadFile2 = async (req, folder) => {
    var upl_file = req.file.originalname;

    let file_name = "uploads/"+folder+"/"+upl_file.replace(/\s+/g, '');
    fs.writeFileSync(file_name, req.file.buffer);
    return file_name;
}

const uploadVideoFile = async (req, folder) => {
    let file_name = "uploads/" + folder + "/video_" + req.file.originalname;
    fs.writeFileSync(file_name, Buffer.from(new Uint8Array(req.file.buffer)));
    return file_name;
}

module.exports = {
    uploadFile,
    uploadFile2,
    uploadVideoFile
};