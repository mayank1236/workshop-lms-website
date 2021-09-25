var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

const { convertCSVToArray } = require('convert-csv-to-array');

const reportAdd = async (req,res,next)=>{
    let str = Buffer.from(req.file.buffer).toString();
    // console.log("Request", req.file, str);
    var arrayOfArraysWithoutHeader = convertCSVToArray(str,{
        header: false,
        separator: ",", //use the separator used in csv file (e.g. '\t', ',', ';' ...)
    });
    // console.log("Array of array without headers", arrayOfArraysWithoutHeader);
}

const reportDwld = function(model){
    const HEADER = [];

    // console.log(model)
    Object.keys(model[0]).forEach(function (key) {
        if (key != "_id") {
          if (
            typeof model[0][key] != "undefined" &&
            typeof model[0][key] == "object"
          ) {
            Object.keys(model[0]).forEach(function (keyy) {
              let customKey = key + "_" + keyy;
              HEADER.push({ id: customKey, title: customKey });
            });
          } else {
            HEADER.push({ id: key, title: key });
          }
        }
      });
      console.log("Headers", HEADER);
      let newDataStor = [];
      model.forEach((element) => {
      let customObject = {};
      Object.keys(element).forEach(function (key) {
        if (key != "_id") {
          if (
            typeof element != "undefined" &&
            typeof element == "object"
          ) {
            Object.keys(element).forEach(function (keyy) {
              let customKey = key + "_" + keyy;
              customObject[customKey] = element[keyy];
            });
          } else {
            customObject[key] =  element;
          }
        }
      });
      newDataStor.push(customObject);
    });
        const csvWriter = createCsvWriter({
          path: "out.csv",
          header: HEADER,
        });
        
        return csvWriter
          .writeRecords(newDataStor)
          .then(() => console.log("The CSV file was written successfully"));
}

module.exports = {
    reportAdd,
    reportDwld
}