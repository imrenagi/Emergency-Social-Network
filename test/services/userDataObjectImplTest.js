var expect = require('expect.js');
var sinon = require('sinon');

var db = require('../../services/db');
var UserDataObject = require('../../services/userDataObjectImpl');

var userDataObject;
var dbMock;

suite('User Data Object Impl Test', function() {

	setup(function(done) {
		dbMock = sinon.mock(db);
		userDataObject = new UserDataObject(db);
		done();
	});

	test('Should return empty array if there is no email registered',function(done) {
		var queryCallBack = {
		  query: function(q, cb) {			  	
		  	cb(null, []);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		userDataObject.getAllEmails().then(res => {
			expect(res.length).to.be.eql(0);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('Should return all emails if they are available',function(done) {
		var queryCallBack = {
		  query: function(q, cb) {			  	
		  	cb(null, [
		  		{email: "imre@nagi.com"},
		  		{email: "nagi@gmail.com"}
		  	]);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		
		userDataObject.getAllEmails().then(res => {
			expect(res[0]).to.be.eql("imre@nagi.com");
			expect(res[1]).to.be.eql("nagi@gmail.com");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.restore();
			done(err);
		});
	});

	test('Should be able to catch error if get all emails is error',function(done) {
		var queryCallBack = {
		  query: function(q, cb) {			  	
		  	var err = new Error("This is errorX");
		  	cb(err, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		userDataObject.getAllEmails().then(res => {
			dbMock.restore();
			done(res);
		}).catch(err => {			
			expect(err.message).to.be.eql("This is errorX");
			dbMock.verify();
			dbMock.restore();
			done();
		});
	});

	test('Should send promise resolve if updating email is success', function(done) {
		var email = "imre.nagi2812@gmail.com";
		var id = 1;

		var queryCallBack = {
		  query: function(q, cb) {
		  	expect(q).to.be.eql('update users set email = "imre.nagi2812@gmail.com" where id = "1";');
		  	cb(null, {status : "success"});
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		userDataObject.updateEmails(id, email).then(res => {
			expect(res.status).to.be.eql("success");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	});

	test('Should send promise reject if updating email is failed', function(done) {
		var email = "imre.nagi2812@gmail.com";
		var id = 1;

		var queryCallBack = {
		  query: function(q, cb) {
		  	expect(q).to.be.eql('update users set email = "imre.nagi2812@gmail.com" where id = "1";');
		  	cb({status : "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		userDataObject.updateEmails(id, email).then(res => {			
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.status).to.be.eql("failed");
			dbMock.verify();
			dbMock.restore();
			done();
		})
	});

	test('Should return Promise resolve containing an email if db query is success', function(done) {
		var id = 1;
		var queryCallBack = {
		  query: function(q, param, cb) {
		  	cb(null, [{email:"imre.nagi2812@gmail.com"}]);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDataObject.getEmail(id).then(res => {
			expect(res.email).to.be.eql("imre.nagi2812@gmail.com");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		});
	})

	test('Should return Promise resolve containing empty string if there is no email for that user', function(done) {
		var id = 1;
		var queryCallBack = {
		  query: function(q, param, cb) {
		  	cb(null, [{email:""}]);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDataObject.getEmail(id).then(res => {
			expect(res.email).to.be.eql("");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		});
	})

	test('Should return Promise reject containing error if query to db is failed', function(done) {
		var id = 1;
		var queryCallBack = {
		  query: function(q, param, cb) {
		  	cb({status : "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		userDataObject.getEmail(id).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.status).to.be.eql("failed");
			dbMock.verify();
			dbMock.restore();
			done();
		})
	})
});
