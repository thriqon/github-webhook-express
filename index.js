
/*jslint indent:2 */

"use strict";

var Netmask = require('netmask').Netmask,
  request = require('request');

module.exports = function () {
  var validIpRanges = [new Netmask('192.30.252.0/22')],
    res = function (req, eres, next) {
      req.githubevent = req.headers['x-github-event'] || null;
      req.githubdeliveryid = req.headers['x-github-delivery'] || null;
      req.isByGithub = validIpRanges.some(function (range) { return range.contains(req.socket.remoteAddress); });
      next();
    };

  res.refreshAllowedIps = function (callback) {
    request(process.env.npm_package_config_githubmetaapi, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        validIpRanges = JSON.parse(body).hooks.map(function (str) { return new Netmask(str); });
        callback(null, res);
      } else {
        callback(error);
      }
    });
  };

  res.validIpRanges = function (newrange) {
    if (newrange instanceof Array) {
      validIpRanges = newrange;
    } else {
      return validIpRanges;
    }
  };
  return res;
};
