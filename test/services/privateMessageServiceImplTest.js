var expect = require('expect.js');
var sinon = require('sinon');

var PrivateMessageDAOImpl = require('../../services/privateMessageDAOImpl');
var PrivateMessageServiceImpl = require('../../services/privateMessageServiceImpl');

var privateMessageDAO = new PrivateMessageDAOImpl();
var privateMessageService = new PrivateMessageServiceImpl(privateMessageDAO);
var privateMessageDAOMock = sinon.mock(privateMessageDAO);

suite('Private Message Service Implementation Test', function() {

	test('Get All Private Message should called dao for private message', function() {
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

 
})
