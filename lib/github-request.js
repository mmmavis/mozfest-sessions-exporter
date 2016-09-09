var _ = require("underscore");
var request = require("request");

module.exports = function(options, userCreds, cb) {
  request(_.extend({
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "mozfest-sessions-exporter"
    },
    auth: {
      user: userCreds.username,
      pass: userCreds.token
    },
    json: true
  }, options), cb);
};
