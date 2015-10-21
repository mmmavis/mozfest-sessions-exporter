var express = require("express");
var app = express();
var chalk = require("chalk");
var GoogleSpreadsheet = require("google-spreadsheet");
var githubRequest = require("./github-request");

var Habitat = require("habitat");
Habitat.load(".env");
var env = new Habitat("", {
  port: 9999
});
app.set("port", env.get("port"));

var GITHUB_USER_CRED = {
  username: env.get("GITHUB_USERNAME"),
  password: env.get("GITHUB_PASSWORD")
};
var GITHUB_API_ISSUES_ENDPOINT = "https://api.github.com/repos/" + env.get("GITHUB_REPO") + "/issues";

console.log(GITHUB_API_ISSUES_ENDPOINT);

var options = {
    method: "GET",
    url: GITHUB_API_ISSUES_ENDPOINT
  };

githubRequest(options, GITHUB_USER_CRED, function(error, response, body) {
  if (error) {
    console.log("\nErrorrrrr", error, "\n");
  } 
  if (response.statusCode != 200 && response.statusCode != 201) {
    console.log("Response status HTTP " + response.statusCode + ", Github error message: " + response.body.message);
  } else {
    console.log("\n\n Success \n\n");
    console.log("///// number of issues found: ", body.length, "\n\n\n");
    body.forEach(parseGithubForSpreadsheet);
  }
});

var parseGithubForSpreadsheet = function (githubTicket) {
  // console.log(githubTicket);
  var ticketBody = githubTicket.body;
  var headerText = {
    description: "\r\n\r\n### Description\r\n",
    agenda: "### Agenda\r\n",
    facilitator: "\r\n**[ Facilitator ]** "
  };
  var parsedRowData = {
    githubIssueNumber: githubTicket.number,
    name: githubTicket.title,
    space: githubTicket.milestone ? githubTicket.milestone.title : null,
    pathways: githubTicket.labels.map(function(label) {
      return label.name
    }),
    description: parseGithubMeta( ticketBody,
                                  ticketBody.indexOf(headerText.description) + headerText.description.length,
                                  ticketBody.indexOf(headerText.agenda)
    ),
    facilitator: parseGithubMeta( ticketBody,
                                  ticketBody.indexOf(headerText.facilitator) + headerText.facilitator.length,
                                  ticketBody.indexOf(headerText.description)
    )
  };
  console.log(parsedRowData);
}

function parseGithubMeta(ticketBody, indexStart, indexEnd) {
  return ticketBody.substring(indexStart, indexEnd);
}


app.get("/", function(req, res) {
  res.send("Hello World :D <br/><br/> You have reached the 'MozFest Sessions Exporter'");
});

app.listen(app.get("port"), function() {
  console.log(chalk.cyan("Server listening on port %d...\n"), app.get("port"));
});
