var GoogleSpreadsheet = require("google-spreadsheet");
var chalk = require("chalk");

var SHEET_INDEX = 1; // sheet index starts from 1
var SESSION_START_INDEX = 0;

module.exports = function(googleApiCred, sessions, spreadsheetID) {
  var currentIndex = SESSION_START_INDEX;
  var mozfestSessionSpreadsheet = new GoogleSpreadsheet(spreadsheetID);
  mozfestSessionSpreadsheet.useServiceAccountAuth(googleApiCred, function(err) {
    function addRowByRow() {
      var rowData = sessions[currentIndex];
      mozfestSessionSpreadsheet.addRow(SHEET_INDEX, rowData, function(err) {
        if (err) {
          console.log("\n[Error adding Session Index#"+currentIndex+ "]", err);
        } else {
          console.log("\nDone adding Session Index#", currentIndex);
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
