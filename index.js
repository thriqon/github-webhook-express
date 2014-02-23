
"use strict";

var Netmask = require('netmask').Netmask;

var request = require('request');

module.exports = function () {
	var _validIpRanges = [new Netmask('192.30.252.0/22')];

	var res = function (req, res, next) {
		req.githubevent = req.headers['x-github-event'] || null;
		req.githubdeliveryid = req.headers['x-github-delivery'] || null;
		req.isByGithub = _validIpRanges.some(function (range) { return range.contains(req.socket.remoteAddress); });
		next();
	};

	res.refreshAllowedIps = function (callback) {
		request(process.env.npm_package_config_githubmetaapi, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				_validIpRanges = JSON.parse(body).hooks.map(function (str) { return new Netmask(str); });
				callback(null, res);
			} else {
				callback(error);
			}
		});
	};

	res.validIpRanges = function (newrange) {
		if (newrange instanceof Array) {
			_validIpRanges = newrange;
		} else {
			return _validIpRanges;
		}
	};
	return res;		
};
