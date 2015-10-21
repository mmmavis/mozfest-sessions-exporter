var tokenizer = require("./tokenizer");
var chalk = require("chalk");

module.exports = function (githubTicket) {
  console.log(chalk.yellow(("\n\n========= "+ githubTicket.number )));
  var ticketBody = githubTicket.body;
  var tokenizedMeta = tokenizer(ticketBody);
  var parsedRowData = {
    githubIssueNumber: githubTicket.number,
    name: githubTicket.title,
    space: githubTicket.milestone ? githubTicket.milestone.title : null,
    pathways: githubTicket.labels.map(function(label) {
      return label.name
    }),
    description: tokenizedMeta.Description,
    facilitator: tokenizedMeta.facilitator,
    oldSpreasheetRowNumber: tokenizedMeta.oldSpreasheetRowNumber
  };
  console.log(parsedRowData);
  console.log("\n\n");
}
