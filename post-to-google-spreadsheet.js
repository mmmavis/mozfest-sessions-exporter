var GoogleSpreadsheet = require("google-spreadsheet");
var chalk = require("chalk");

var GOOGLE_API_CRED = require('./do_not_share/MozFest-2015-Schedule-App-2b8e537b4020.json');

var SHEET_INDEX = 1; // sheet index starts from 1
var SESSION_START_INDEX = 0;

module.exports = function(sessions, spreadsheetID) {
  var currentIndex = SESSION_START_INDEX;
  var mozfestSessionSpreadsheet = new GoogleSpreadsheet(spreadsheetID);
  mozfestSessionSpreadsheet.useServiceAccountAuth(GOOGLE_API_CRED, function(err) {
    function addRowByRow() {
      var rowData = sessions[currentIndex];
      mozfestSessionSpreadsheet.addRow(SHEET_INDEX, rowData, function(err) {
        if (err) {
          console.log("[Error adding Session Index#"+currentIndex+ "]", err);
        } else {
          console.log("Done adding Session Index#", currentIndex);
        }
        currentIndex++;
        if ( currentIndex < sessions.length) {
          addRowByRow();
        } else {
          console.log(chalk.cyan("=== Done posting", sessions.length,"rows ===\n"));
        }
      });
    }
    addRowByRow();
  });
};
