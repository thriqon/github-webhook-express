
var chai = require('chai');
var sinon = require('sinon');
chai.should();
chai.use(require('sinon-chai'));

var subject = require('../index.js');

describe('GithubWebhook Express Middleware', function () {
	it('should be a function', function () {
		subject.should.be.a('function');
	});

	it('should be a function returning a function', function () {
		subject().should.be.a('function');
	});

	it('should call the third parameter (next)', function () {
		var spy = sinon.spy();
		subject()({headers: {}, socket: {remoteAddress: '8.8.8.8'}}, {}, spy);
		spy.should.have.been.called;
	});
});
