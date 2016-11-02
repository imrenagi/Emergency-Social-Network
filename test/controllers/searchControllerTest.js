var expect = require('expect.js');
var sinon = require('sinon');
var request = require('supertest');
var server = request.agent("http://localhost:3000");
var db = require('../../services/db');

var express = require('express');
var app = express();

function getDbEnvironment() {
  if (app.get('env') === 'test') {
    return db.MODE_TEST;
  } else if (app.get('env') === 'circle') {
    return db.MODE_CIRCLE_TEST;
  }  else {
    return db.MODE_PRODUCTION;
  }
} 

suite('Search Controller Test', function() {

	setup(function(done) {

		db.connect(getDbEnvironment(), function(err){
 			if (err) {
    			process.exit(1)
  			} 
		});
		server.get("/testing/users").expect(200, done);
	})

	teardown(function(done) {
		server.get("/testing/users").expect(200, done);
	})

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

	test('search announcements', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1)', function(err, result) {
			if (err) {
				//Fail
				done()
			}
			else {
				db.get().query('INSERT INTO announcements (sender_id, message, latitude, longitude) VALUES (?, "test announcement", 100, 100)', result.insertId, function(err, result) {
					if (err) {
						//Fail
						done()
					}
					else {
						server
							.post("/join/confirm")
							.send({
								"user_name" : "Xiangtian",
								"password" : "12345"
							})
	    					.expect(200, function() {
	    						server
	    						.get("/search/announcement?query=announcement")
	    						.end(function(err, result) {
									expect(result.body.results[0].text).to.be.eql('test announcement');
									done();
								});
	    					});
					}
				});
			}
		});
	});

	// test('search public messages', function(done) {
	// 	db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1)', function(err, result) {
	// 		if (err) {
	// 			//
	// 			done()
	// 		}
	// 		else {
	// 			db.get().query('INSERT INTO public_messages (sender_id, message, message_status, latitude, longitude) VALUES (?, "test message", 0, 100, 100)', result.insertId, function(err, result) {
	// 				if (err) {
	// 					//Fail
	// 					done()
	// 				}
	// 				else {
	// 					server
	// 						.post("/join/confirm")
	// 						.send({
	// 							"user_name" : "Xiangtian",
	// 							"password" : "12345"
	// 						})
	//     					.expect(200, function() {
	//     						server
	//     						.get("/search/public_message?query=message")
	//     						.end(function(err, result) {
	// 								expect(result.body.results[0].text).to.be.eql('test message');
	// 								done();
	// 							});
	//     					});
	// 				}
	// 			});
	// 		}
	// 	});
	// });

	// test('undefined search type must return 400', function(done) {
	// 	server
	// 		.post("/join/confirm")
	// 		.send({
	// 			"user_name" : "Xiangtian",
	// 			"password" : "12345"
	// 		})
	//     	.expect(200, function() {
	//     		server
	//     			.get("/search/undefined_search_type")
	//     			.end(function(err, result) {
	// 					expect(result.error.status).to.be.eql(400);
	// 					done();
	// 				});
	//     	});
	//  });
})