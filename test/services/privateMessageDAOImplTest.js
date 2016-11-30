var expect = require('expect.js');
var sinon = require('sinon');

var db = require('../../services/db');
var PrivateMsgDAO = require('../../services/privateMessageDAOImpl');

var privateMsgDAO;
var dbMock;

suite('Private Message DAO Impl Test', function() {

	setup(function(done) {
		dbMock = sinon.mock(db);
		privateMsgDAO = new PrivateMsgDAO(db);
		done();
	});

	test('Should return all conversation owned by a user id', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql('SELECT id FROM conversations WHERE user1_id = 1 OR user2_id = 1');		  	
		  	cb(null, [1,2,3,4]);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);

		privateMsgDAO.getAllConversatonsByUserId(1).then(res => {
			expect(res.length).to.be.eql(4);
			dbMock.verify();
			dbMock.restore();
			done()
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		});
	});

	test('Error returned by getting all conversation should be detectable', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql('SELECT id FROM conversations WHERE user1_id = 1 OR user2_id = 1');		  	
		  	cb({status : "failed"}, null);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);

		privateMsgDAO.getAllConversatonsByUserId(1).then(res => {			
			dbMock.verify();
			dbMock.restore();
			done()
		}).catch(err => {
			expect(err.status).to.be.eql("failed");
			dbMock.verify();
			dbMock.restore();
			done();
		});
	});

	test('Should return all messages by conversation id for correct user', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	cb(null, [{
		  		conversation_id : 12,
		  		sender_id : 3,
		  		receiver_id : 1,
		  		sender_name : "Jhon",
		  		receiver_name : "Asep",
		  		unread_count : 2
		  	}, {
		  		conversation_id : 3,
		  		sender_id : 1,
		  		receiver_id : 2,
		  		sender_name : "Asep",
		  		receiver_name : "Toni",
		  		unread_count : 1
		  	}, {
		  		conversation_id : 4,
		  		sender_id : 9,
		  		receiver_id : 1,
		  		sender_name : "Johan",
		  		receiver_name : "Asep",
		  		unread_count : 7
		  	}])
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		privateMsgDAO.getMessagesByConversations(1, "12,3,4").then(res => {
			expect(res.length).to.be.eql(3);
			expect(res[0].conversation_id).to.be.eql(12);
			expect(res[1].conversation_id).to.be.eql(3);
			expect(res[2].conversation_id).to.be.eql(4);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

	test('Should be able to catch error message if get message by conversation return error', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	cb({status : "failed" }, null)
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		privateMsgDAO.getMessagesByConversations(1, "12,3,4").then(res => {
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

	test('Should return all messages in from a conversationId', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql('SELECT p.*, u.user_name from private_messages p left join users u on u.id = p.sender_id WHERE p.conversation_id = 1 order by p.id desc');		  	
		  	cb(null, [{
		  		id : 1,
		  		user_name : "Johan",
		  		message : "This is message"
		  	}]);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		privateMsgDAO.getPrivateMessagesByConversationId(1, 0, 0).then(res => {
			expect(res.length).to.be.eql(1);
			expect(res[0].id).to.be.eql(1);
			expect(res[0].user_name).to.be.eql("Johan");
			expect(res[0].message).to.be.eql("This is message");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

	test('Create new converation should return inserted id', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {
		  	expect(v).to.be.eql([100,200]);
		  	cb(null, {insertId : 1});
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		privateMsgDAO.createConversation(100, 200).then(res => {
			expect(res).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

	test('Should receive error when creating the conversation return errors', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {
		  	expect(v).to.be.eql([100,200]);
		  	cb({status : "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		privateMsgDAO.createConversation(100, 200).then(res => {
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

	test('Should return conversation id with two user ids as the input', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {
		  	cb(null, {id : 29});
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		privateMsgDAO.getConversationId(1, 2).then(res => {
			expect(res.id).to.be.eql(29);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	});

	test('Should catch error if get conversation id return error', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {
		  	cb({status : "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		privateMsgDAO.getConversationId(1, 2).then(res => {
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

	test('Should update the read flags by message id and return the results as it is', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {
		  	cb(null, "success");
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		privateMsgDAO.updateMessageReadFlagByIds("1,2,3,4").then(res => {
			expect(res).to.be.eql("success");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

	test('Should get the error if updating message flag is failed', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {
		  	cb({status: "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
		privateMsgDAO.updateMessageReadFlagByIds("1,2,3,4").then(res => {
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

	test('Should be able to store message and get stored message', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {
		  	cb(null, [{
		  		id : 1,
		  		sender_id : 1,
		  		sender_name : "imre",
		  		receiver_id : 2,
		  		receiver_name : "nagi"
		  	}]);
		  }
		}
		dbMock.expects('get').twice().returns(queryCallBack);

		privateMsgDAO.storePrivateMessage([1,"imre", 2, "nagi", 1, "message", 0, 0.0, 0.0, 0]).then(res => {
			expect(res.id).to.be.eql(1);
			expect(res.sender_id).to.be.eql(1);
			expect(res.sender_name).to.be.eql("imre");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		})
	})

	test('Should be to get the error message when storing the message is error', function(done) {
		var queryCallBack = {
		  query: function(q, v, cb) {
		  	cb({status : "failed"}, null);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		privateMsgDAO.storePrivateMessage([1,"imre", 2, "nagi", 1, "message", 0, 0.0, 0.0, 0]).then(res => {
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

	test('Should return correct json in searching by message', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb(null, [{id:1, message:"imre message", total:3}, 
		  		{id:2, message:"second message"}, 
		  		{id:3, message:"third message"}]);
		  }
		}

		dbMock.expects('get').twice().returns(queryCallBack);
	
		privateMsgDAO.searchByQuery(1, ["message"], 0, 10).then(res => {
			expect(res.data.length).to.be.eql(3);
			expect(res.data[0].id).to.be.eql(1);
			expect(res.data[0].message).to.be.eql("imre message");
			expect(res.data[1].id).to.be.eql(2);
			expect(res.data[1].message).to.be.eql("second message");
			expect(res.data[2].id).to.be.eql(3);
			expect(res.data[2].message).to.be.eql("third message");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		});
	});

	test('Should return correct json in searching by message with multiple keywords', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb(null, [{id:1, message:"imre message", total:3}, 
		  		{id:2, message:"second message"}, 
		  		{id:3, message:"third message"}]);
		  }
		}

		dbMock.expects('get').twice().returns(queryCallBack);
	
		privateMsgDAO.searchByQuery(1, ["message", "bagus"], 0, 10).then(res => {
			expect(res.data.length).to.be.eql(3);
			expect(res.data[0].id).to.be.eql(1);
			expect(res.data[0].message).to.be.eql("imre message");
			expect(res.data[1].id).to.be.eql(2);
			expect(res.data[1].message).to.be.eql("second message");
			expect(res.data[2].id).to.be.eql(3);
			expect(res.data[2].message).to.be.eql("third message");
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.verify();
			dbMock.restore();
			done(err);
		});
	});

	test('Should error in searching by message if the database is error', function(done) {
		var queryCallBack = {
		  query: function(q, cb) {		  	
		  	cb({status : "failed"}, null);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);
	
		privateMsgDAO.searchByQuery(1, ["message", "bagus"], 0, 10).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err.status).to.be.eql("failed")
			dbMock.verify();
			dbMock.restore();
			done();
		});
	});


});

// searchByQuery(userId, keywords, offset, limit) {
// 		var that = this;
// 		var paginationQuery = 'SELECT count(*) total from private_messages p WHERE ( p.message like ';
// 		var query = 'SELECT p.*, p.sender_name as user_name from private_messages p WHERE ( p.message like '; 
// 		var keyword;
// 		for(var i = 0; i < keywords.length; i++) {
// 			if(i === 0) {
// 				keyword = '\'%' + keywords[i] + '%\' ';
// 			}
// 			else {
// 				keyword = 'OR p.message like \'%' + keywords[i] + '%\' ';
// 			}
// 			paginationQuery = paginationQuery + keyword;
// 			query = query + keyword;
// 		}
// 		paginationQuery = paginationQuery + ') AND (sender_id = ' + userId + ' OR  receiver_id = ' + userId + ' )';
// 		query = query + ') AND (sender_id = ' + userId + ' OR  receiver_id = ' + userId + ' ) order by p.id desc limit ' + offset + ' , '+ limit;
 
// 		return new Promise(function(resovle, reject) {
// 			that.db.get().query(paginationQuery, function(err, result) {
// 				if(err) {
// 					reject(err);
// 				}
// 				else {
// 					let total_count = JSON.parse(JSON.stringify(result[0])).total;
// 					resovle(total_count);
// 				}
// 			});
// 		}).then(function(total_count) {
// 			return new Promise(function(resovle, reject) {
// 				that.db.get().query(query, function(err, results) {
// 					if(err) {
// 						reject(err);
// 					}
// 					else {
// 						var json = {
// 							data: JSON.parse(JSON.stringify(results)),
// 							total: total_count
// 						};
// 						resovle(json);
// 					}
// 				});
// 			});
// 		});
// 	}




