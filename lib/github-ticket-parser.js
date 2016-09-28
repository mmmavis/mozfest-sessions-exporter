var tokenizer = require("./tokenizer");
var chalk = require("chalk");

module.exports = function (githubTicket, cb) {
  console.log(chalk.blue(("=== Github Ticket # "+ githubTicket.number)));
  var ticketBody = githubTicket.body;
  var tokenizedMeta = tokenizer(ticketBody);

  // Make sure keys in parsedRowData object match spreadsheet column names.
  // Note that 'id' seems to be a reserved key by Google Sheet so remember to
  // not use 'id' as your key.

  var space = "";
  var pathwayArray = [];

  githubTicket.labels.forEach(function(label) {
    var labelName = label.name;
    var spacelabelPrefix =  "[Space] ";
    var mozExLabel = "[Experience] Moz Ex";
    var pathwaylabelPrefix =  "[Pathway] ";

    if (labelName.substr(0,spacelabelPrefix.length) === spacelabelPrefix) {
      // regular Spaces
      space = labelName.substr(spacelabelPrefix.length);
      if (space === "A tale of two cities: dilemmas in connected spaces") {
        space = "Dilemmas in connected spaces";
      }
    } else if (labelName === mozExLabel) {
      // MozEx
      space = "MozEx";
    }

    if (labelName.substr(0,pathwaylabelPrefix.length) === pathwaylabelPrefix) {
      pathwayArray.push[labelName.substr(pathwaylabelPrefix.length)];
    }
  })

  var parsedRowData = {
    "session id": githubTicket.number,
    name: githubTicket.title,
    space: space,
    pathways: pathwayArray.join(", "),
    description: tokenizedMeta.Description ? tokenizedMeta.Description.filter(function(v) { return !!v; }).join("\n") : "",
    "facilitator 1 name": tokenizedMeta.submitterName,
    "facilitator 1 twitter": tokenizedMeta.submitterTwitter || "",
    "facilitator 1 affiliated org": tokenizedMeta.submitterOrg || "",
    proposalId: tokenizedMeta.proposalId
  };
  cb(parsedRowData);
}
