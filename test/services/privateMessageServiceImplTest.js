var expect = require('expect.js');
var sinon = require('sinon');

var PrivateMessageDAOImpl = require('../../services/privateMessageDAOImpl');
var PrivateMessageServiceImpl = require('../../services/privateMessageServiceImpl');
var PrivateMessageDAOInterface = require('../../services/interfaces/privateMessageDAO');
var PrivateMessageServiceInterface = require('../../services/interfaces/privateMessageService');

var privateMessageDAO = new PrivateMessageDAOImpl();
var privateMessageService = new PrivateMessageServiceImpl(privateMessageDAO);
var privateMessageDAOMock = sinon.mock(privateMessageDAO);

suite('Private Message Service Implementation Test', function() {

	test('interface should return override error', function() {
		var dao = new PrivateMessageDAOInterface();
		expect(Error("Must override!")).to.be.eql(dao.getAllConversatonsByUserId());
		expect(Error("Must override!")).to.be.eql(dao.getPrivateMessagesByConversationId())
		expect(Error("Must override!")).to.be.eql(dao.getMessagesByConversations())
		expect(Error("Must override!")).to.be.eql(dao.createConversation())
		expect(Error("Must override!")).to.be.eql(dao.storePrivateMessage())
		expect(Error("Must override!")).to.be.eql(dao.getConversationId())
		expect(Error("Must override!")).to.be.eql(dao.updateMessageReadFlagByIds())
		expect(Error("Must override!")).to.be.eql(dao.searchByQuery())

		var service = new PrivateMessageServiceInterface();
			expect(Error("Must override!")).to.be.eql(service.getAllConversations());
			expect(Error("Must override!")).to.be.eql(service.getAllPrivateMessages());
			expect(Error("Must override!")).to.be.eql(service.storePrivateMessage());
			expect(Error("Must override!")).to.be.eql(service.createConversation());
			expect(Error("Must override!")).to.be.eql(service.getConversationId());
			expect(Error("Must override!")).to.be.eql(service.updateMessageReadFlag());
	})

	test('Get All Private Message should call dao for private message', function() {
		privateMessageDAOMock.expects('getPrivateMessagesByConversationId').once().withExactArgs(1,1,1).returns(
			Promise.resolve({})
		);
		privateMessageService.getAllPrivateMessages(1,1,1);
		privateMessageDAOMock.verify()
		privateMessageDAOMock.restore()
	})

	test('Create Conversation should trigger call to database', function() {
		var senderId = 1;
		var receiverId = 2;
		privateMessageDAOMock.expects('createConversation').once().withExactArgs(senderId, receiverId);

		privateMessageService.createConversation(senderId, receiverId);
		privateMessageDAOMock.verify()
		privateMessageDAOMock.restore()
	})

	test('Store Private Message should sent correct query to trigger database', function() {
		var senderId = 1
		var senderName = 'Steve'
		var receiverId = 2
		var receiverName = 'Chris'
		var conversationId = 1
		var message = 'This is the message'
		var messageStatus = 1
		var latitude = 150.2
		var longitude = 100.0

		var values = [senderId, senderName, receiverId, receiverName, conversationId, message, messageStatus, latitude, longitude];
		privateMessageDAOMock.expects('storePrivateMessage').once().withExactArgs(values).returns(
			Promise.resolve({})
		);;

		privateMessageService.storePrivateMessage(senderId, senderName, receiverId, receiverName, 
			conversationId, message, messageStatus, latitude, longitude);
		privateMessageDAOMock.verify()
		privateMessageDAOMock.restore()

	})

	test('Conversation target should be the target user', function(done) {
		var userId = 1;
		var result = {
			conversation_id: 123,
			sender_id: 1,
			sender_name: 'John',
			receiver_id: 2,
			receiver_name: 'Serra',
			unread_count: 10
		}

		var expectedConversation = {
			id: result.conversation_id,
			target: {
				id: result.receiver_id,
				user_name: result.receiver_name
			},
			unread_count: result.unread_count
		}

		var formattedConversation = privateMessageService.formatConversation(userId, result)
		expect(expectedConversation).to.be.eql(formattedConversation)
		done()
	})

	test('Conversation target should be the user who sent the message', function(done) {
		var userId = 2;
		var result = {
			conversation_id: 123,
			sender_id: 1,
			sender_name: 'John',
			receiver_id: 2,
			receiver_name: 'Serra',
			unread_count: 10
		}

		var expectedConversation = {
			id: result.conversation_id,
			target: {
				id: result.sender_id,
				user_name: result.sender_name
			},
			unread_count: result.unread_count
		}

		var formattedConversation = privateMessageService.formatConversation(userId, result)
		expect(expectedConversation).to.be.eql(formattedConversation)
		done()
	})

test('Get all conversations should get no conversations for invalid UserId', function(done) {
		var userid = -1;
		privateMessageDAOMock.expects('getAllConversatonsByUserId').once().withExactArgs(-1).returns(
			Promise.resolve({})
		);
		privateMessageService.getAllConversations(userid);
		privateMessageDAOMock.verify()
		privateMessageDAOMock.restore()
		done()
	})

test('Get conversation ID should return empty result for same sending and recieving user', function(done) {
		var senderid = 1;
		var receiverid = 1;
		privateMessageDAOMock.expects('getConversationId').once().withExactArgs(senderid,receiverid).returns(
			Promise.resolve({})
		);
		privateMessageService.getConversationId(senderid,receiverid);
		privateMessageDAOMock.verify()
		privateMessageDAOMock.restore()
		done()
	})



test('Update Message Read flags should call DAO for updating message ids', function(done) {
		var messageid = 123;
		privateMessageDAOMock.expects('updateMessageReadFlagByIds').once().withExactArgs('123').returns(
			Promise.resolve({})
		);
		privateMessageService.updateMessageReadFlag(messageid);
		privateMessageDAOMock.verify()
		privateMessageDAOMock.restore()
		done()
	})


 
})
