const { Parser } = require('json2csv');
const fields = ['_id', 'userid', 'subscr_id', 'seller_comission', 'price', 'subscribed_on', 'no_of_listing', 'status']
const opts = { fields }
var fs = require("fs");
var userSubscriptions = require('../../Models/subscr_purchase');
//var csv_reports = require('../../service/csv_reports');

const allUserSubscriptions = async (req,res)=>{
    userSubscriptions.find({})
      .then(data=>{
        const json2csvParser = new Parser(opts);
        const csvData = json2csvParser.parse(data);

        fs.writeFile("out.csv", csvData, function(error) {
          if (error) throw error;
          console.log("Write to out.csv successfully!");
        });
        console.log(csvData);
      })
    
}

module.exports = {
    allUserSubscriptions
}