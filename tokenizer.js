/**
 * Formatting:
 *
 *   "**[ Google Spreadsheet Row Number ]**" + inline number
 *   "**[ Facilitator ]**" + inline text
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
  oldSpreasheetRowNumber(line, lines, result);
  facilitate(line, lines, result);
  ["Description", "Agenda", "Participants", "Outcome"].forEach(function(item) {
    blockMatch(item, line, lines, result);
  });
}

function oldSpreasheetRowNumber(line, lines, result) {
  if (line.indexOf("**[ Google Spreadsheet Row Number ]**") !== -1) {
    result.oldSpreasheetRowNumber = parseInt(line.match(/\*\* (.+)$/)[1]);
    return true;
  }
  return false;
}

function facilitate(line, lines, result) {
  if (line.indexOf("**[ Facilitator ]**") !== -1) {
    result.facilitator = line.match(/\*\* (.+)$/)[1].trim();
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
