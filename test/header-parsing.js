
"use strict";

require('chai').should();
var sinon = require('sinon');

var subject = require('../index.js');

describe('Header Parsing', function () {
	describe('event type', function () {
		it('should set the event type as value in the req parameter', function () {
			var req = {headers: {"x-github-event": "ping"}, socket: {remoteAddress: '8.8.8.8'}};
			subject()(req, {}, function () {});
			req.should.have.property('githubevent', 'ping');
		});
		it('should mark requests without github event header with null', function () {
			var req = {headers: {}, socket: {remoteAddress: '8.8.8.8'}};
			subject()(req, {}, function () {});
			req.should.have.property('githubevent', null);
		});
	});

	describe('delivery id', function () {
		it('should set the delivery id as value in the req parameter', function () {
			var req = {headers: {"x-github-delivery": "as2lkajdjalsd"}, socket: {remoteAddress: '8.8.8.8'}};
			subject()(req, {}, function () {});
			req.should.have.property('githubdeliveryid', req.headers['x-github-delivery']);
		});
		it('should set the delivery id to null if not set', function () {
			var req = {headers: {}, socket: {remoteAddress: '8.8.8.8'}};
			subject()(req, {}, function () {});
			req.should.have.property('githubdeliveryid', null);
		});
	});
});
