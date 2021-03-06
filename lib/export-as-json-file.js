var jsonfile = require('jsonfile');
var moment = require("moment");
var chalk = require("chalk");

var JSON_DIR_PATH = "./exported-json";

module.exports = function(fileContent, cb) {
  var filePath = JSON_DIR_PATH + "/" + moment(Date.now()).format("YYYYMMDD-hh.mm.ssA") + ".json";
  jsonfile.writeFile(filePath, fileContent, {spaces: 2}, function(err) {
    if (err) {
      cb(err);
    }
    console.log(chalk.blue("\n\n [JSON] Done saving file. " + filePath + " was saved!" ));
    cb();
  });
};
