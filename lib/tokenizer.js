/**
 * Formatting:
 *   See: https://raw.githubusercontent.com/mozilla/mozillafestival.org/master/issue-template.md
 *
 *   "**[ ID ]**" + inline number
 *
 *   "**[ Submitter's Name ]**" + inline text
 *   "**[ Submitter's Affiliated Organisation ]**" + inline text
 *   "**[ Submitter's Twitter ]**" + inline text
 *
 *   "**[ Space ]**" + inline text
 *   "**[ Secondary Space ]**" + inline text
 *
 *   "**[ Exhibit Method ]** + inline text
 *   "**[ Exhibit Link ]*" + inline text
 *
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
  proposalId(line, lines, result);
  submitterName(line, lines, result);
  submitterOrg(line, lines, result);
  submitterTwitter(line, lines, result);
  ["Description", "Agenda", "Participants", "Outcome"].forEach(function(item) {
    blockMatch(item, line, lines, result);
  });
}

function proposalId(line, lines, result) {
  if (line.indexOf("**[ ID ]**") !== -1) {
    result.proposalId = line.match(/\*\* (.+)$/) ? line.match(/\*\* (.+)$/)[1].trim() : undefined;
    return true;
  }
  return false;
}

function submitterName(line, lines, result) {
  if (line.indexOf("**[ Submitter's Name ]**") !== -1) {
    result.submitterName = line.match(/\*\* (.+)$/) ? line.match(/\*\* (.+)$/)[1].trim() : undefined;
    return true;
  }
  return false;
}

function submitterOrg(line, lines, result) {
  if (line.indexOf("[ Submitter's Affiliated Organisation ]") !== -1) {
    result.submitterOrg = line.match(/\*\* (.+)$/) ? line.match(/\*\* (.+)$/)[1].trim() : undefined;
    return true;
  }
  return false;
}

function submitterTwitter(line, lines, result) {
  if (line.indexOf("[ Submitter's Twitter ]") !== -1) {
    result.submitterTwitter = line.match(/\*\* (.+)$/) ? line.match(/\*\* (.+)$/)[1].trim() : undefined;
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
