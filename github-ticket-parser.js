var tokenizer = require("./tokenizer");
var chalk = require("chalk");

module.exports = function (githubTicket, cb) {
  console.log(chalk.yellow(("\n\n========= "+ githubTicket.number )));
  var ticketBody = githubTicket.body;
  var tokenizedMeta = tokenizer(ticketBody);
  var parsedRowData = {
    githubIssueNumber: githubTicket.number,
    name: githubTicket.title,
    space: githubTicket.milestone ? githubTicket.milestone.title : "",
    pathways: githubTicket.labels.map(function(label) {
      return label.name
    }).join(", "),
    description: tokenizedMeta.Description ? tokenizedMeta.Description.filter(function(v) { return !!v; }).join("\n") : "",
    facilitator: tokenizedMeta.facilitator,
    proposalSpreadsheetRowNumber: tokenizedMeta.oldSpreadsheetRowNumber
  };
  // console.log(parsedRowData);
  // console.log("\n\n");
  cb(parsedRowData);
}
