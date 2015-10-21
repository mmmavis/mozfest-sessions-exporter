var express = require("express");
var app = express();
var chalk = require("chalk");
var GoogleSpreadsheet = require("google-spreadsheet");
var githubRequest = require("./github-request");
var githubTicketParser = require("./github-ticket-parser");
var exportAsJsonFile = require("./export-as-json-file");
var exportAsCsvFile = require("./export-as-csv-file");

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
var GITHUB_API_ISSUES_ENDPOINT = "https://api.github.com/repos/" + env.get("GITHUB_REPO") + "/issues" + "?per_page=100";

var currentPageNum = 1;
var morePagesAhead = true;
var allParsedSessions = [];

function traverseWithPagination(pageNum,cb) {
  githubRequest(
    {
      method: "GET",
      url: GITHUB_API_ISSUES_ENDPOINT + "&page=" + pageNum
    }, 
    GITHUB_USER_CRED,
    function(error, response, body) {
      currentPageNum++;
      if (error) {
        console.log("\nErrorrrrr", error, "\n");
      } 
      if (response.statusCode != 200 && response.statusCode != 201) {
        console.log("Response status HTTP " + response.statusCode + ", Github error message: " + response.body.message);
      } else {
        console.log("\n\n Success \n\n");
        console.log("///// number of issues found: ", body.length, "\n\n\n");
        body.forEach(function(ticket) {
          githubTicketParser(ticket, function(parsedSession) {
            allParsedSessions.push(parsedSession);
          })
        });
        if ( response.headers.link.indexOf('rel="last"') === -1 ) {
          morePagesAhead = false;
        }
      }
      cb();
  });
}

function go() {
  if (morePagesAhead) {
    console.log("\n\n\n currentPageNum = ", currentPageNum ,"\n\n\n");
    traverseWithPagination(currentPageNum, function() { 
      go();
    });
  } else {
    console.log(allParsedSessions);
    exportAsJsonFile(allParsedSessions,function(err) {
      if (err) {
        console.log("Error exporting json file: ", err);
      }
    });
    exportAsCsvFile(allParsedSessions, function(err) {
      if (err) {
        console.log("Error exporting csv file: ", err);
      }
    })
  }
}

go();

app.get("/", function(req, res) {
  res.send("Hello World :D <br/><br/> You have reached the 'MozFest Sessions Exporter'");
});

app.listen(app.get("port"), function() {
  console.log(chalk.cyan("Server listening on port %d...\n"), app.get("port"));
});
