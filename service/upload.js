var fs = require("fs");

const uploadFile = async (req, folder) => {
    let file_name = "uploads/"+folder+"/image_"+req.file.originalname;
    fs.writeFileSync(file_name, req.file.buffer);
    return file_name;
}

const uploadAudioFile = async (req, folder) => {
    let file_name = "uploads/" + folder + "/audio_" + req.file.originalname;
    fs.writeFileSync(file_name, Buffer.from(new Uint8Array(req.file.buffer)));
    return file_name;
}

module.exports = {
    uploadFile,
    uploadAudioFile
};