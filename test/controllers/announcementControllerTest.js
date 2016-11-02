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

db.connect(getDbEnvironment(), function(err){
	if (err) {} 
	else {}
});

suite('Announcement Controller Test', function() {

	setup(function(done) {
		server.get("/testing/users").expect(200, done)
	})

	teardown(function(done) {
		server.get("/testing/users").expect(200, done)
	})

	test('can retrive all announcements', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1)', function(err, result) {
			if (err) {
				//Fail
				done(err);
			}
			else {
				db.get().query('INSERT INTO announcements (sender_id, message, latitude, longitude) VALUES (?, "test announcement", 100, 100)', result.insertId, function(err, result) {
					if (err) {
						//Fail
						done(err);
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
	    						.get("/announcement")
	    						.end(function(err, result) {
									expect(result.body.announcements[0].text).to.be.eql('test announcement');
									done();
								});
	    					});
					}
				});
			}
		});
	});


});