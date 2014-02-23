
"use strict";

var Netmask = require('netmask').Netmask;

module.exports = function () {
	var validIpRange = new Netmask('192.30.252.0/22');
	return function (req, res, next) {
		req.githubevent = req.headers['x-github-event'] || null;
		req.githubdeliveryid = req.headers['x-github-delivery'] || null;
		req.isByGithub = validIpRange.contains(req.socket.remoteAddress);
		next();
	};
};
