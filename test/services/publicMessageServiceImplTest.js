var expect = require('expect.js');
var sinon = require('sinon');

var PublicMessageServiceImpl = require('../../services/publicMessageServiceImpl');
var db = require('../../services/db');

var publicMessageService;
var dbMock;

suite('Public Message Service Implementation Test', function(){

	setup(function(done) {
		dbMock = sinon.mock(db);
		publicMessageService = new PublicMessageServiceImpl(db);
		done();
	});

	test('Should be able to get all messages started with page 1', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	cb(null, [{
		  		id : 1,
		  		created_at : "2016-11-29 19:55:57",
		  		message : "This is a message",
		  		message_status : "1",
		  		latitude : 100.0,
		  		longitude : 120.0,
		  		sender_id : 20,
		  		user_name : "imre",
		  		online: 1,
		  		status: 0
		  	}]);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);
	
		publicMessageService.getAllMessages(-1,10).then(res => {
			expect(res.length).to.be.eql(1);
			expect(res[0].id).to.be.eql(1);
			expect(res[0].sender.id).to.be.eql(20);
			expect(res[0].sender.user_name).to.be.eql("imre");
			expect(res[0].sender.online).to.be.eql(1);
			expect(res[0].sender.status).to.be.eql(0);
			expect(res[0].text).to.be.eql('This is a message');
			expect(res[0].status).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('Should be able to get all messages using offset and limit', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	cb(null, [{
		  		id : 1,
		  		created_at : "2016-11-29 19:55:57",
		  		message : "This is a message",
		  		message_status : "1",
		  		latitude : 100.0,
		  		longitude : 120.0,
		  		sender_id : 20,
		  		user_name : "imre",
		  		online: 1,
		  		status: 0
		  	}]);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);
	
		publicMessageService.getAllMessages(10,5).then(res => {
			expect(res.length).to.be.eql(1);
			expect(res[0].id).to.be.eql(1);
			expect(res[0].sender.id).to.be.eql(20);
			expect(res[0].sender.user_name).to.be.eql("imre");
			expect(res[0].sender.online).to.be.eql(1);
			expect(res[0].sender.status).to.be.eql(0);
			expect(res[0].text).to.be.eql('This is a message');
			expect(res[0].status).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('Should be able to get the error message when getting all messages', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	cb({status : "failed"}, null);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);
	
		publicMessageService.getAllMessages(10,5).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {		
			expect(err.status).to.be.eql("failed");
			dbMock.restore();
			done();
		});
	});

	test('Should be able to store message to database', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {	
		  	cb(null, [{
		  		id : 1,
		  		created_at : "2016-11-29 19:55:57",
		  		message : "This is a message",
		  		message_status : "1",
		  		latitude : 100.0,
		  		longitude : 120.0,
		  		sender_id : 20,
		  		user_name : "imre",
		  		online: 1,
		  		status: 0
		  	}] );
		  }
		}

		dbMock.expects('get').twice().returns(queryCallBack);
	
		publicMessageService.storeMessage(20, "This is a message", 1, 100.0, 120.0).then(res => {
			expect(res.id).to.be.eql(1);
			expect(res.sender.id).to.be.eql(20);
			expect(res.sender.user_name).to.be.eql("imre");
			expect(res.sender.online).to.be.eql(1);
			expect(res.sender.status).to.be.eql(0);
			expect(res.timestamp).to.be.eql(1480478157);
			expect(res.text).to.be.eql('This is a message');
			expect(res.status).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {		
			dbMock.restore();
			done(err);
		});
	})

	test('Should be able to get error message when storing message is failed', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {	
		  	cb({status : "failed"},  null);
		  }
		}

		dbMock.expects('get').twice().returns(queryCallBack);
	
		publicMessageService.storeMessage(20, "This is a message", 1, 100.0, 120.0).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {	
			expect(err.status).to.be.eql("failed");
			dbMock.restore();
			done();
		});
	})

})
