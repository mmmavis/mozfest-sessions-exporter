/**
 * Formatting:
 *
 *   "**[ Google Spreadsheet Row Number ]**" + inline number
 *      Or "### Google Spreadsheet Row Number" + text until next ### or EOF
 *   "**[ Facilitator ]**" + inline text
 *      Or "### Facilitator"
 *          "name:" facilitator #1's name
 *          "twitter:" @twitter_handle
 *          "organization:" organization name
 *          "name:" facilitator #2's name
 *          "twitter:" @twitter_handle
 *          "organization:" organization name
 *   "### Description" + text until next ### or EOF
 *   "### Agenda" + text until next ### or EOF
 *   "### Participants"  + text until next ### or EOF
 *   "### Outcome" +  + text until next ### or EOF
 *
 */
var tokenize = function(text) {
  var lines = text.split("\n").map(function(l) { return l.trim(); });
  var result = {};
  while(lines.length) {
    parse(lines, result);
  }  
  // console.log(result);
  return result;
}

function parse(lines, result) {
  var line = lines.splice(0,1)[0];
  oldSpreadsheetRowNumber(line, lines, result);
  facilitate(line, lines, result);
  ["Description", "Agenda", "Participants", "Outcome"].forEach(function(item) {
    blockMatch(item, line, lines, result);
  });
}

function oldSpreadsheetRowNumber(line, lines, result) {
  if (line.indexOf("**[ Google Spreadsheet Row Number ]**") !== -1) {
    result.oldSpreadsheetRowNumber = line.match(/\*\* (.+)$/) ? parseInt(line.match(/\*\* (.+)$/)[1]) : undefined;
    return true;
  }
  return false;
}

function facilitate(line, lines, result) {
  if (line.indexOf("**[ Facilitator ]**") !== -1) {
    result.facilitator = line.match(/\*\* (.+)$/) ? line.match(/\*\* (.+)$/)[1].trim() : undefined;
    return true;
  }
  return false;
}

function blockMatch(blockName, line, lines, result) {
  if (line.indexOf("### "+blockName) > -1) {
    var data = [];
    while(lines.length) {
      if (lines[0].indexOf("###")>-1) break;
      data.push(lines.splice(0,1)[0]);
    }
    result[blockName] = data;
  }
  return false;
}

module.exports = tokenize;
