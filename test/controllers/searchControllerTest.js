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
	if (err) {
    	process.exit(1)
  	} 
});

suite('Search Controller Test', function() {

	setup(function() {
		db.get().query('delete from announcements')
		db.get().query('delete from users;')
		db.get().query('INSERT INTO users (id, user_name, password, online, status) VALUES (1, "Sam", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 1)');		
	})

	teardown(function() {
		db.get().query('delete from announcements')
		db.get().query('delete from users;')
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
		db.get().query('INSERT INTO announcements (sender_id, message, latitude, longitude) VALUES (1, "test announcement 1", 100, 100)');
		db.get().query('INSERT INTO announcements (sender_id, message, latitude, longitude) VALUES (1, "test announcement 2", 100, 100)');
		db.get().query('INSERT INTO announcements (sender_id, message, latitude, longitude) VALUES (1, "test announcement 3", 100, 100)');
		server.post("/join/confirm")
			.send({
				"user_name" : "Sam",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server.get("/search/announcement?query=announcement")
	    			.end(function(err, result) {
						
						// expect(result.body.results.length).to.be.eql(3);
						done();
				});
			});
	});

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