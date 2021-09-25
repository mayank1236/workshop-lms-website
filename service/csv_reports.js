var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
var createdCsvWriter = require('csv-writer').createObjectCsvWriter;

const { convertCsvToArray } = require('convert-csv-to-array');