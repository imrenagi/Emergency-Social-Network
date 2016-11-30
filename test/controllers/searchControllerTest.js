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

	test('search users by name matches several result in the page two must have correct number', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1),'+
			'("Samx", "12345", 0, 1),'+
			'("Samy", "12345", 0, 1),'+
			'("Samy", "12345", 0, 1),'+
			'("Samy", "12345", 0, 1),'+
			'("Samy", "12345", 0, 1),'+
			'("Sem", "12345", 0, 1),'+
			'("Samo", "12345", 0, 1)', function(err, result) {
			server
				.post("/join/confirm")
				.send({
					"user_name" : "Xiangtian",
					"password" : "12345"
				})
		    	.expect(200, function() {
		    		server
		    			.get("/search/user_name?query=sam&page=2&limit=4")
		    			.end(function(err, result) {
							expect(result.body.results.length).to.be.eql(3)
							done();
						});
		    	});
	    })
	});

		test('search users by name matches several result in page one must have online user in the first position', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1),'+
			'("Samx", "12345", 1, 1),'+
			'("Samy", "12345", 0, 1),'+
			'("Sem", "12345", 0, 1),'+
			'("Samo", "12345", 1, 1)', function(err, result) {
			server
				.post("/join/confirm")
				.send({
					"user_name" : "Xiangtian",
					"password" : "12345"
				})
		    	.expect(200, function() {
		    		server
		    			.get("/search/user_name?query=sam&page=1&limit=10")
		    			.end(function(err, result) {
							expect(result.body.results.length).to.be.eql(4)
							expect(result.body.results[0].online).to.be.eql(1)
							expect(result.body.results[1].online).to.be.eql(1)
							expect(result.body.results[2].online).to.be.eql(0)
							expect(result.body.results[3].online).to.be.eql(0)

							expect(result.body.results[0].user_name).to.be.eql('Samo')
							expect(result.body.results[1].user_name).to.be.eql('Samx')
							done();
						});
		    	});
	    })
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

	test('search users with wrong status should return empty result', function(done) {
		server
			.post("/join/confirm")
			.send({
				"user_name" : "Xiangtian",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/user_status?query=5")
	    			.end(function(err, result) {
						expect(result.body.results.length).to.be.eql(0);
						done();
					});
	    	});
	});

	test('search users with status should return correct number', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES '+
		    '("Sam", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 0),'+
			'("Samx", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 1, 0),'+
			'("Samy", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 0),'+
			'("Sem", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 1),'+
			'("Samo", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 1, 1)', function(err, result) {
		server
			.post("/join")
			.send({
				"user_name" : "Sam",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/user_status?query=0&limit=10")
	    			.end(function(err, result) {
						expect(result.body.results.length).to.be.eql(3);
						done();
					});
	    	});
	    })
	});

	test('search users with status should return correct number and correct order', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES '+
		    '("Sam", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 0),'+
			'("Samx", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 1, 0),'+
			'("Samy", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 0),'+
			'("Sem", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 1),'+
			'("Samo", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 1, 1)', function(err, result) {
		server
			.post("/join")
			.send({
				"user_name" : "Sam",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/user_status?query=0&limit=10")
	    			.end(function(err, result) {
						expect(result.body.results[0].user_name).to.be.eql('Sam');
						expect(result.body.results[1].user_name).to.be.eql('Samx');
						expect(result.body.results.length).to.be.eql(3);
						done();
					});
	    	});
	    })
	});

	test('search users with status should return correct number and correct order in page 2', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES '+
		    '("Sam", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 1),'+
			'("Samx", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 1, 1),'+
			'("Samy", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 1),'+
			'("Sem", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 0, 1),'+
			'("Samo", "$2a$10$BUwisyRk8r4Qn1Y3nv4HLeI4XfgYTOwMp0NxlMzXx4dmvZpmBiWs6", 1, 1)', function(err, result) {
		server
			.post("/join")
			.send({
				"user_name" : "Sam",
				"password" : "12345"
			})
	    	.expect(200, function() {
	    		server
	    			.get("/search/user_status?query=1&page=2&limit=3")
	    			.end(function(err, result) {
						expect(result.body.results[0].user_name).to.be.eql('Samy');
						expect(result.body.results[1].user_name).to.be.eql('Sem');
						expect(result.body.results.length).to.be.eql(2);
						done();
					});
	    	});
	    })
	});	

	test('search announcements', function(done) {
		db.get().query('INSERT INTO users (user_name, password, online, status) VALUES ("Sam", "12345", 0, 1)', function(err, result) {
			if (err) {
			}
			else {
				db.get().query('INSERT INTO announcements (sender_id, message, latitude, longitude) VALUES (?, "test announcement", 100, 100)', result.insertId, function(err, result) {
					if (err) {
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

	test('empty search type must return 400', function(done) {
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