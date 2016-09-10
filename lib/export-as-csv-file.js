var json2csv = require('json2csv');
var mkdirp = require("mkdirp");
var fs = require("fs");
var moment = require("moment");
var chalk = require("chalk");

var CSV_DIR_PATH = "./exported-csv";


// Note: remember to update this according to the up to date spreadsheet columns
var COLUMN_NAMES = [
  "theId",
  "name",
  "category",
  "tags",
  "description",
  "facilitator 1 name",
  "facilitator 1 twitter",
  "facilitator 1 affiliated org",
  "proposalId"
];

module.exports = function(jsonBlob, cb) { 
  var json2csvOptions = {
    data: jsonBlob, 
    fields: COLUMN_NAMES,
    nested: true,
    del: "\t"
  };
  json2csv(json2csvOptions, function(err, parsedCsv) {
    if (err) {
      console.log(err);
    }
    mkdirp(CSV_DIR_PATH, function (err) {
      if (err) {
        console.error(err);
        cb(err);
      }
      else {
        var filePath = CSV_DIR_PATH + "/" + moment(Date.now()).format("YYYYMMDD-hh.mm.ssA") + ".csv";
        console.log(filePath);
        fs.writeFile(filePath, parsedCsv, function(err) {
          if(err) {
            console.log(err);
            cb(err);
          }
          console.log(chalk.blue("\n\n [CSV] Done saving file. " + filePath + " was saved!" ));
          cb();
        }); 
      }
    });
  });
};
