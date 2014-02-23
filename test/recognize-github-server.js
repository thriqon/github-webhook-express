
var chai = require('chai');
var sinon = require('sinon');
chai.should();
chai.use(require('sinon-chai'));

var nock = require('nock');
var Netmask = require('netmask').Netmask;

var subject = require('../index.js');

function executeAndReturnReq(subject, req) {
	subject(req, {}, function () {});
	return req;
}

describe('GithubWebhook Express Middleware', function () {
	it('should recognize Githubs servers by builtin list', function () {
		executeAndReturnReq(subject(), {headers: {}, socket: {remoteAddress: "10.0.0.1"}}, {}, function () {}).isByGithub.should.be.not.ok
		executeAndReturnReq(subject(), {headers: {}, socket: {remoteAddress: "192.30.252.1"}}, {}, function () {}).isByGithub.should.be.ok;
	});

	it('should recognize by downloading list from Githubs API', function (done) {
		var metaAPI = nock('https://api.github.com/')
			.get('/meta')
			.reply(200, {
					"hooks": [
						"10.0.0.0/22",
						"192.168.0.0/24"
					]
				});
		subject().refreshAllowedIps(function (err, subjectInstance) {
			executeAndReturnReq(subjectInstance, {headers: {}, socket: {remoteAddress: "10.0.0.1"}}, {}, function () {}).isByGithub.should.be.ok;
			executeAndReturnReq(subjectInstance, {headers: {}, socket: {remoteAddress: "192.168.0.1"}}, {}, function () {}).isByGithub.should.be.ok;
			executeAndReturnReq(subjectInstance, {headers: {}, socket: {remoteAddress: "192.168.1.1"}}, {}, function () {}).isByGithub.should.not.be.ok;
			executeAndReturnReq(subjectInstance, {headers: {}, socket: {remoteAddress: "10.0.1.1"}}, {}, function () {}).isByGithub.should.be.ok;
			executeAndReturnReq(subjectInstance, {headers: {}, socket: {remoteAddress: "10.0.5.1"}}, {}, function () {}).isByGithub.should.not.be.ok;
			executeAndReturnReq(subjectInstance, {headers: {}, socket: {remoteAddress: "8.8.8.8"}}, {}, function () {}).isByGithub.should.not.be.ok;
			done();
		});
	});

	it('should return the list of ranges', function (done) {
		var metaAPI = nock('https://api.github.com/')
		.get('/meta')
		.reply(200, {
			"hooks": [
			"10.0.0.0/22",
			"192.168.0.0/24"
			]
		});
		subject().refreshAllowedIps(function (err, subjectInstance) {
			subjectInstance.validIpRanges().should.have.length(2);
			done();
		});
	});

	it('should set the list of ranges', function () {
		var subjectInstance = subject();
		subjectInstance.validIpRanges([new Netmask('10.0.0.0/24')]);
		subjectInstance.validIpRanges()[0].first.should.be.equal('10.0.0.1');
	});
});

