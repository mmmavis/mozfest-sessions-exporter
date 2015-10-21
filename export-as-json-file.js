var mkdirp = require("mkdirp");
var fs = require("fs");
var moment = require("moment");

var JSON_DIR_PATH = "./exported-json";

module.exports = function(fileContent, cb) {
  mkdirp(JSON_DIR_PATH, function (err) {
    if (err) {
      console.error(err);
      cb(err);
    }
    else {
      var filePath = JSON_DIR_PATH + "/" + moment(Date.now()).format("YYYYMMD-hh.mm.ssA") + ".json";
      console.log(filePath);
      fs.writeFile(filePath, fileContent, function(err) {
        if(err) {
          console.log(err);
        }
        console.log(filePath + " was saved!");
        cb();
      }); 
    }
  });
};
