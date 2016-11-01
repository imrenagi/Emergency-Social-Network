var expect = require('expect.js');
var sinon = require('sinon');
var request = require('supertest');
var server = request.agent("http://localhost:3000");
var db = require('../../services/db');

suite('Search Controller Test', function() {

	setup(function(done) {
		server.get("/testing/users").expect(200, done);
		// server
		// 	.post("/join/confirm")
		// 	.send({
		// 		"user_name" : "Xiangtian",
		// 		"password" : "12345"
		// 	})
	 //    	.expect(200, done);

	    	// server
	    	// .get("/search/undi")
	    	// .expect(400, done);
	  //   	.end(function(err, result) {
			// 	expect(result.error.status).to.be.eql(400);
			// });
	})

	teardown(function(done) {
		server.get("/testing/users").expect(200, done)
	})

	// test('new join to community must return 204', function(done) {
	// 	server
	// 		.post("/join")
	// 		.send({
	// 			"user_name" : "imre",
	// 			"password" : "imre"
	// 		})
	//     	.expect(204, done);
	// })

	// test('new join to community with under quality password should get 400', function(done) {
	// 	server
	// 		.post("/join")
	// 		.send({
	// 			"user_name" : "imre",
	// 			"password" : "I"
	// 		})
	//     	.end(function(err, result) {
	//     		message = JSON.parse(result.error.text)
	//     		expect(400).to.be.eql(result.error.status)
	//     		expect('JoinError.PasswordIsUnderMinimumQuality').to.be.eql(message.message)
	// 	        done();
	// 	    });
	// })


	test('undefined search type must return 400', function(done) {
		server
			.post("/join/confirm")
			.send({
				"user_name" : "Xiangtian",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/undi")
	    			.end(function(err, result) {
						expect(result.error.status).to.be.eql(400);
						done();
					});
	    	});
	 });
})