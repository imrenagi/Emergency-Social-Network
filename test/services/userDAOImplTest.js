var expect = require('expect.js');
var sinon = require('sinon');

var db = require('../../services/db');
var UserDAO = require('../../services/userDAOImpl');

var userDAO;
var dbMock;

suite('UserDAO Impl Test', function() {

	setup(function(done) {
		dbMock = sinon.mock(db);
		userDAO = new UserDAO(db);
		done();
	});

	test('Should be able to update online status to online', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("UPDATE users SET online = 1 WHERE id = 1");		  	
		  	cb(null, {resultId : 1});
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		var user = {
			getId: function() {
				return 1;
			}
		}

		userDAO.updateOnline(user, 1).then(res => {
			expect(res.resultId).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('Should be able to update online status to offline', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("UPDATE users SET online = 0 WHERE id = 1");		  	
		  	cb(null, {resultId : 1});
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		var user = {
			getId: function() {
				return 1;
			}
		}

		userDAO.updateOnline(user, 0).then(res => {
			expect(res.resultId).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('Should get correct error message if updating user error', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	cb({status: "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		var user = {
			getId: function() {
				return 1;
			}
		}

		userDAO.updateOnline(user, 1).then(res => {
			dbMock.verify();
			dbMock.restore();
			done(res);
		}).catch(err => {			
			expect(err.status).to.be.eql("failed");
			dbMock.verify
			dbMock.restore();
			done();
		});
	});

	test('Should be able to update status of user', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("UPDATE users SET status = 1, status_updated_at = now() WHERE id = 1");		  	
		  	cb(null, {resultId : 1});
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		userDAO.updateStatus(1, 1).then(res => {
			expect(res.resultId).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('Should be able to update status of user with latitude and longitude', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("UPDATE users SET status = 2, status_updated_at = now(), latitude = 90, longitude = 100 WHERE id = 1");		  	
		  	cb(null, {resultId : 1});
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		userDAO.updateStatus(1, 2, 90.0, 100.0).then(res => {
			expect(res.resultId).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('Should return user data from database', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("SELECT * FROM users WHERE id = 1");		  	
		  	cb(null, [{id : 1, name: "imre"}]);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		userDAO.getUser(1).then(res => {
			expect(res.id).to.be.eql(1);
			expect(res.name).to.be.eql("imre");		
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.restore();
			done(err);
		});
	});

	test('Should get same error if getting user profile is failed', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("SELECT * FROM users WHERE id = 1");		  	
		  	cb({status: "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		userDAO.getUser(1).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.status).to.be.eql("failed");
			dbMock.verify();
			dbMock.restore();
			done();
		});
	});

	test('Should return correct json in searching by username', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb(null, [{id:1, user_name:"imre", total:3}, {id:2, user_name:"nagi"}, {id:3, user_name:"nagi2"}]);
		  }
		}
		dbMock.expects('get').twice().returns(queryCallBack);
	
		userDAO.searchByUserName(1, 0, 10).then(res => {
			expect(res.data[0].id).to.be.eql(1);
			expect(res.data[0].user_name).to.be.eql("imre");
			expect(res.data[1].id).to.be.eql(2);
			expect(res.data[1].user_name).to.be.eql("nagi");
			expect(res.data[2].id).to.be.eql(3);
			expect(res.data[2].user_name).to.be.eql("nagi2");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		});
	});

	test('Should return error in retrieving page number in searching by status', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb({status: "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		userDAO.searchByStatus(1, 0, 10).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.status).to.be.eql("failed");
			dbMock.verify();
			dbMock.restore();
			done();
		});
	});

	test('Should return correct json in getting all users', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb(null, [{id:1, user_name:"imre", total:3}, {id:2, user_name:"nagi"}, {id:3, user_name:"nagi2"}]);
		  }
		}
		dbMock.expects('get').twice().returns(queryCallBack);
	
		userDAO.getAllUsers(0, 10).then(res => {
			expect(res.data[0].id).to.be.eql(1);
			expect(res.data[0].user_name).to.be.eql("imre");
			expect(res.data[1].id).to.be.eql(2);
			expect(res.data[1].user_name).to.be.eql("nagi");
			expect(res.data[2].id).to.be.eql(3);
			expect(res.data[2].user_name).to.be.eql("nagi2");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		});
	});

	test('Should be able to update user data without password', function(done) {
		var queryCallBack = {
			query: function(q, v, cb) {		  	
		  		cb(null, {insertId : 1});
		  	}
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDAO.updateUserWithoutPassword(1, ["imre", 1, 0]).then(res => {
			expect(res.insertId).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

	test('Should be able to update user data with password', function(done) {
		var queryCallBack = {
			query: function(q, v, cb) {		  	
		  		cb(null, {insertId : 1});
		  	}
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDAO.updateUser(1, ["imre", 1, 0, "password"]).then(res => {
			expect(res.insertId).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

	test('Should be able to get error message when update user data with password is failing', function(done) {
		var queryCallBack = {
			query: function(q, v, cb) {		  	
		  		cb({message: "error in db"}, null);
		  	}
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDAO.updateUser(1, ["imre", 1, 0, "password"]).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.message).to.be.eql("error in db");
			dbMock.verify();
			dbMock.restore();
			done();
		})
	})

	test('Should be able to get error message when update user data without password is failing', function(done) {
		var queryCallBack = {
			query: function(q, v, cb) {		  	
		  		cb({message: "error in db"}, null);
		  	}
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDAO.updateUserWithoutPassword(1, ["imre", 1, 0]).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.message).to.be.eql("error in db");
			dbMock.verify();
			dbMock.restore();
			done();
		})
	})

	test('Should be able to get error when get all user returned error', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb({status : "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		userDAO.getAllUsers(0, 10).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.status).to.be.eql("failed");
			dbMock.verify();
			dbMock.restore();
			done();
		});
	})

	test('Should be able to read the error when update status is failed', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb({status : "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		userDAO.updateStatus(0, 10).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.status).to.be.eql("failed");
			dbMock.verify();
			dbMock.restore();
			done();
		});
	})

	test('Should be able to update user lat and long', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {		  	
		  	expect(q).to.be.eql('UPDATE users SET latitude = ?, longitude = ? WHERE id = 1');
		  	expect(v).to.be.eql([110.2, 12.12]);
		  	cb(null, {insertId : 10});
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDAO.updateUserLocation(1, 110.2, 12.12).then(res => {
			expect(res.insertId).to.be.eql(10);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

	test('Should get email whose valid locations', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb(null, [{
				latitude : 37.3789,
				longitude : -121.866,
				email : "binglei.du@sv.cmu.edu"
			}, {
				latitude : 37.4123,
				longitude : -122.059,
				email : "imre.nagi2812@gmail.com"
			}, {
				latitude : 37.4123,
				longitude : -122.059,
				email : "inagi@andrew.cmu.edu"
			}]);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDAO.getUserEmailsWhoseValidLocation().then(res => {
			expect(res.length).to.be.eql(3);
			expect(res[0].email).to.be.eql("binglei.du@sv.cmu.edu");
			expect(res[1].email).to.be.eql("imre.nagi2812@gmail.com");
			expect(res[2].email).to.be.eql("inagi@andrew.cmu.edu");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

});


