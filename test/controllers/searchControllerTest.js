var expect = require('expect.js');
var sinon = require('sinon');
var request = require('supertest');
var server = request.agent("http://localhost:3000");
var db = require('../../services/db');

suite('Search Controller Test', function() {

	setup(function(done) {
		// db.connect(db.MODE_TEST, function(err){
 	// 		if (err) {
  //   			console.log('Unable to connect to MySQL')
  //   			process.exit(1)
  // 			} 
		// });
		server.get("/testing/users").expect(200);
		server.get('/testing/public_messages_setup');
		done();
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
	test('search users with full user_name', function(done) {
		server
			.post("/join/confirm")
			.send({
				"user_name" : "Xiangtian",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/user_name?query=Xiangtian")
	    			.end(function(err, result) {
						expect(result.body.results[0].user_name).to.be.eql('Xiangtian');
						done();
					});
	    	});
	});

	test('search users with partial user_name', function(done) {
		server
			.post("/join/confirm")
			.send({
				"user_name" : "Xiangtian",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/user_name?query=tian")
	    			.end(function(err, result) {
						expect(result.body.results[0].user_name).to.be.eql('Xiangtian');
						done();
					});
	    	});
	});

	test('search users with status', function(done) {
		server
			.post("/join/confirm")
			.send({
				"user_name" : "Xiangtian",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/user_status?query=0")
	    			.end(function(err, result) {
						expect(result.body.results[0].user_name).to.be.eql('Xiangtian');
						done();
					});
	    	});
	});

	// test('search public messages', function(done) {
	// 	// db.get().query('INSERT INTO public_messages (sender_id)', function(err, results) {
	// 	// 	console.log('hello');
	// 	// });
	// 	server
	// 		.post("/join/confirm")
	// 		.send({
	// 			"user_name" : "Xiangtian",
	// 			"password" : "12345"
	// 		})
	//     	.expect(200, function() {
	//     		server
	//     			.get("/search/public_message?query=message")
	//     			.end(function(err, result) {
	//     				console.log(result);
	// 					expect(result.results[0].text).to.be.eql('test message');
	// 					done();
	// 				});
	//     	});
	// });


	test('undefined search type must return 400', function(done) {
		server
			.post("/join/confirm")
			.send({
				"user_name" : "Xiangtian",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/undefined_search_type")
	    			.end(function(err, result) {
						expect(result.error.status).to.be.eql(400);
						done();
					});
	    	});
	 });
})