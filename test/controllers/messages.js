var request = require('supertest');
var app = require('../../app');
var sinon = require('sinon');
var message = require('../../models/message')
var expect = require('chai').expect;

var server = request.agent("http://localhost:3000");

describe("Messages unit test", function(){
	describe("Integration testing", function(){
		it("get first message should return 200", function(done){
			server
				.get("/message/first")
				.set('Accept', 'application/json')
	      		.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it("post message should return 200", function(done){
			server
				.post("/message")
				.send({
					"user_name":"jhon",
					"text": "send something"
				})
				.expect("Content-type",/json/)
	    		.expect(200, done);
		});

		it("get previous message should return 200", function(done){
			server.get("/message?id=10")
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it("post empty message/user should return 400", function(done){
			server.post("/message")
			.send({
				"user_name":"",
				"text":""
			})
			.expect("Content-type",/json/)
	    	.expect(400, done);
		})		
	});

	describe("Data testing", function(){
		it("get latest messages", function(done){
			var messageMock = sinon.mock(message);
			var expectedResult = [];
			messageMock.expects('getLatestMessages').yields(null, expectedResult);
			message.getLatestMessages(10, function(err, res){
				messageMock.verify();
				messageMock.restore();
				expect(res).to.have.length(0);
				done();
			});
		})

	})
});





