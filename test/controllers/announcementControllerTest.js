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
		server.get('/testing/users').expect(200, done)
	})

	teardown(function(done) {
		server.get('/testing/users').expect(200, done)
	})

	test('Unauthrozed user should get 401', function(done) {
		server.get("/announcement").expect(401, done);
	})

	test('Should gave one annoncement', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1)', function(err, result) {
			if (err) {done(err)}
			else {
				db.get().query('INSERT INTO announcements (sender_id, message, latitude, longitude) VALUES (?, "test announcement", 100, 100)', result.insertId, function(err, result) {
					if (err) {done(err)}
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
									expect(result.body.announcements.length).to.be.eql(1);
									done();
								});
	    					});
					}
				});
			}
		});
	});

	test('Should gave multiple announcements in the page one', function(done) {
    	db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1)', function(err, result) {
    		id = result.insertId;
			db.get().query('INSERT INTO announcements (sender_id, message, latitude, longitude) VALUES ('+id+', "test announcement", 100, 100),'+
				'('+id+', "test announcement", 100, 100),' +
				'('+id+', "test announcement", 100, 100),' +
				'('+id+', "test announcement", 100, 100),' +
				'('+id+', "test announcement", 100, 100);', function(err, result){
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
									expect(result.body.announcements.length).to.be.eql(5);
									done();
								});
	    					});				
			});
		})
	})

	test('Should gave multiple announcements in the page two', function(done) {
    	db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1)', function(err, result) {
    		id = result.insertId;
			db.get().query('INSERT INTO announcements (id, sender_id, message, latitude, longitude) VALUES (1, '+id+', "test announcement", 100, 100),'+
				'(2, '+id+', "test announcement", 100, 100),' +
				'(3, '+id+', "test announcement", 100, 100),' +
				'(4, '+id+', "test announcement", 100, 100),' +
				'(5, '+id+', "test announcement", 100, 100);', function(err, result){
					server
							.post("/join/confirm")
							.send({
								"user_name" : "Xiangtian",
								"password" : "12345"
							})
	    					.expect(200, function() {
	    						server
	    						.get("/announcement")
	    						.query({last_id: 3, limit: 10 })
	    						.end(function(err, result) {
									expect(result.body.announcements.length).to.be.eql(2);
									done();
								});
	    					});				
			});
		})
	})

	test('Should gave empty announcements in the page two if the result is not enough', function(done) {
    	db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1)', function(err, result) {
    		id = result.insertId;
			db.get().query('INSERT INTO announcements (id, sender_id, message, latitude, longitude) VALUES (1, '+id+', "test announcement", 100, 100),'+
				'(2, '+id+', "test announcement", 100, 100),' +
				'(3, '+id+', "test announcement", 100, 100),' +
				'(4, '+id+', "test announcement", 100, 100),' +
				'(5, '+id+', "test announcement", 100, 100);', function(err, result){
					server
							.post("/join/confirm")
							.send({
								"user_name" : "Xiangtian",
								"password" : "12345"
							})
	    					.expect(200, function() {
	    						server
	    						.get("/announcement")
	    						.query({last_id: 1, limit: 10 })
	    						.end(function(err, result) {
									expect(result.body.announcements.length).to.be.eql(0);
									done();
								});
	    					});				
			});
		})
	})


});