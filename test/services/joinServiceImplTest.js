var expect = require('expect.js');
var sinon = require('sinon');

var JoinServiceImpl = require('../../services/joinServiceImpl');
var userDAOImpl = require('../../services/userDAOImpl');
var db = require('../../services/db');
var UserDAO = require('../../services/userDAOImpl');

var userDAO = new userDAOImpl(db);
var joinService = new JoinServiceImpl(userDAO, db);
var userDAOMock = sinon.mock(userDAO);

var dbMock;

suite('Join Service Implementation Test', function() {

	setup(function(done) {
		dbMock = sinon.mock(db);
		done();
	});

	test('Join should return an array of user', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {	
		  	expect(v).to.be.eql("imre");
		  	cb(null, [{id:1, user_name:"imre", password: "password"}]);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);

		joinService.join("imre", "password").then(res => {
			expect(res.length).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	})

	test('Should get error when join returning error promise', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {	
		  	expect(v).to.be.eql("imre");
		  	cb({status: "failed"}, null);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);

		joinService.join("imre", "password").then(res => {
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

	test('Should be able to update user online variable', function(done) {
		var user = {
			online : 0
		}
		var onlineUser = {
			online : 1
		}
		userDAOMock.expects('updateOnline').once().withExactArgs(user, 1).returns(
			Promise.resolve({
				code : 200,
				body : onlineUser
			})
		)
		joinService.updateUserOnlineStatus(user).then(function(res) {
			expect(res.code).to.be.eql(200);
			expect(res.body).to.be.eql({ online : 1 });
			userDAOMock.verify();
			userDAOMock.restore();
			done();
		}).catch(function(err){
			userDAOMock.verify();
			userDAOMock.restore();
			done(err);
		})
	})

	// test('Should be able to return user when updating failed', function(done) {
	// 	var user = {
	// 		online : 0
	// 	}
	// 	userDAOMock.expects('updateOnline').once().withExactArgs(user, 1).returns(
	// 		Promise.reject({
	// 			code : 200,
	// 			body : user
	// 		})
	// 	)
	// 	joinService.updateUserOnlineStatus(user).then(function(res) {
	// 		// expect(res.code).to.be.eql(200);
	// 		// expect(res.body).to.be.eql({ online : 0 });
	// 		userDAOMock.verify();
	// 		userDAOMock.restore();
	// 		done();
	// 	}).catch(function(err){
	// 		userDAOMock.verify();
	// 		userDAOMock.restore();
	// 		done(err);

	// 	})
	// })

	test('Validate user should return 204', function(done) {
		var user = [];
		joinService.validateUser(user, "asep").then(res => {
			expect(res.code).to.be.eql(204);
			done();
		}).catch(err => {
			done(err);
		})
	});

	test('Validate user should return 200 and correct body', function(done) {
		var user = [{
			id: 1,
			user_name: "imre",
			online: 0,
			status: 1,
			privilage: 1,
			password : "$2a$10$f6CHFr7hwxg9mtmFJaD9CeQ5xQkq31Oiss/uPOhJIGv8f1kUxzqgq"
		}]

		joinService.validateUser(user, "asep").then(res => {
			expect(res.code).to.be.eql(200);
			expect(res.body.id).to.be.eql(1);
			expect(res.body.user_name).to.be.eql("imre");
			expect(res.body.online).to.be.eql(0);
			expect(res.body.status).to.be.eql(1);
			expect(res.body.privilage).to.be.eql(1);
			expect(res.body.password).to.be.eql(undefined);
			done();
		}).catch(err => {
			done(err);
		})
	});

	test('Validate user should return 400 and because password is incorrect', function(done) {
		var user = [{
			id: 1,
			user_name: "imre",
			online: 0,
			status: 1,
			privilage: 1,
			password : "$2a$10$f6CHFr7hwxg9mtmFJaD9CeQ5xQkq31Oiss/uPOhJIGv8f1kUxzqgq"
		}]

		joinService.validateUser(user, "asep1").then(res => {
			expect(res.code).to.be.eql(400);
			done();
		}).catch(err => {
			done(err);
		})
	});



});