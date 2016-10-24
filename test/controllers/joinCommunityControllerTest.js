var expect = require('expect.js');
var sinon = require('sinon');
var request = require('supertest');
var server = request.agent("http://localhost:3000");

suite('Join community Controller Test', function() {

	setup(function(done) {
		server.get("/testing/users").expect(200, done)
	})

	teardown(function(done) {
		server.get("/testing/users").expect(200, done)
	})

	test('new join to community must return 204', function(done) {
		server
			.post("/join")
			.send({
				"user_name" : "imre",
				"password" : "imre"
			})
	    	.expect(204, done);
	})

	test('new join to community and confirm should return 200', function(done) {
		server
			.post("/join/confirm")
			.send({
				"user_name" : "imre",
				"password" : "imre"
			})
	    	.expect(200, done);
	})

	test('new join to community with under quality name should get 400', function(done) {
		server
			.post("/join")
			.send({
				"user_name" : "im",
				"password" : "imre"
			})
	    	.end(function(err, result) {
	    		message = JSON.parse(result.error.text)
	    		expect(400).to.be.eql(result.error.status)
	    		expect('JoinError.UserNameIsUnderMinimumQuality').to.be.eql(message.message)
		        done();
		    });
	})

	test('new join to community with under quality password should get 400', function(done) {
		server
			.post("/join")
			.send({
				"user_name" : "imre",
				"password" : "I"
			})
	    	.end(function(err, result) {
	    		message = JSON.parse(result.error.text)
	    		expect(400).to.be.eql(result.error.status)
	    		expect('JoinError.PasswordIsUnderMinimumQuality').to.be.eql(message.message)
		        done();
		    });
	})

	test('new join to community with reserve username should get 400', function(done) {
		server
			.post("/join")
			.send({
				"user_name" : "postmaster",
				"password" : "postmaster"
			})
	    	.end(function(err, result) {
	    		message = JSON.parse(result.error.text)
	    		expect(400).to.be.eql(result.error.status)
	    		expect('JoinError.UserNameIsUnderMinimumQuality').to.be.eql(message.message)
		        done();
		    });
	})

	test('join existing community with incorrect password should get 400', function(done) {
		server.post("/join/confirm").send({
				"user_name" : "imre",
				"password" : "imre"
			}).expect({success:true}, function() {
				server
					.post("/join")
					.send({
						"user_name" : "imre",
						"password" : "imrexxx"
					})
			    	.end(function(err, result) {
			    		message = JSON.parse(result.error.text)
			    		expect(400).to.be.eql(result.error.status)
			    		expect('JoinError.IncorrectPassword').to.be.eql(message.message)
				        done();
				    });
			})
	})

	test('join existing community with correct username and password should get 200', function(done) {
		server.post("/join/confirm").send({
				"user_name" : "imre",
				"password" : "imre"
			}).expect({success:true}, function() {
				server
					.post("/join")
					.send({
						"user_name" : "imre",
						"password" : "imre"
					})
			    	.end(function(err, result) {
			    		body = JSON.parse(result.text)
			    		expect(200).to.be.eql(result.status)
			    		expect('imre').to.be.eql(body.user_name)
			    		expect(1).to.be.eql(body.online)
				        done();
				    });
			})
	})
 
})
