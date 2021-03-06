"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var PrivateMessageService = require('./interfaces/privateMessageService');

class PrivateMessageServiceImpl extends PrivateMessageService {
	constructor(privateMessageDAO) {
		super(privateMessageDAO);
	}

	formatMessage(result) {
		var message = {
			id: result.id,
			sender: {
				id: result.sender_id,
				user_name: result.user_name
			},
			text: result.message,
			timestamp: dateHelper.convertDateToTimestamp(result.created_at),
			status: result.message_status,
			location: {
				lat: result.latitude,
				long: result.longitude
			}
		}
		return message;
	}

	formatConversation(userId, result) {
		var friendId, friendName;
		if(result.sender_id == userId) {
			friendId = result.receiver_id;
			friendName = result.receiver_name;
		}
		else {
			friendId = result.sender_id;
			friendName = result.sender_name;
		}
		var conversation = {
			id: result.conversation_id,
			target: {
				id: friendId,
				user_name: friendName
			},
			unread_count: result.unread_count
		}
		return conversation;
	}

	getAllConversations(userId) {
		var that = this;
		return this.privateMessageDAO.getAllConversatonsByUserId(userId).then(function(results) {
			var res = JSON.parse(JSON.stringify(results));
			var conversations = [];
			for(var i in res) {
				conversations.push(res[i].id);
			}
			var it = that
			return that.privateMessageDAO.getMessagesByConversations(userId, conversations.toString()).then(function(rawMessages) {
				var res = JSON.parse(JSON.stringify(rawMessages));
				var json = R.map(result => it.formatConversation(userId, result), res);
				var output = {
					conversations: json
				}
				return output;
			});
		});
	}

	getAllPrivateMessages(conversationId, lastId, limit) {
		var that = this;
		return this.privateMessageDAO.getPrivateMessagesByConversationId(conversationId, lastId, limit).then(function(results) {
			var res = JSON.parse(JSON.stringify(results));
			var json = R.map(result => that.formatMessage(result), res);
			var output = {
				messages : json
			}
			return output;
		});
	}

	createConversation(senderId, receiverId) {
		return this.privateMessageDAO.createConversation(senderId, receiverId);
	}


	storePrivateMessage(senderId, senderName, receiverId, receiverName, conversationId, message, messageStatus, latitude, longitude) {
		let values = [senderId, senderName, receiverId, receiverName, conversationId, message, messageStatus, latitude, longitude];
		return this.privateMessageDAO.storePrivateMessage(values).then(function(result) {
			var res = JSON.parse(JSON.stringify(result));
			var privateMessage =  {	id: result.id,
									sender_id: result.sender_id,
									sender_name: result.sender_name,
    								receiver_id: result.receiver_id,
    								created_at: dateHelper.convertDateToTimestamp(result.created_at),
    								conversation_id: result.conversation_id,
    								message: result.message,
   							 		message_status: result.message_status,
   							 		location: {
   							 			lat: result.latitude,
   							 			long: result.longitude
   							 		}
    							}
			return privateMessage; 
		}).catch(function(err) {
			return console.log(err);
		});
	}

	getConversationId(senderId, receiverId) {
		return this.privateMessageDAO.getConversationId(senderId, receiverId).then(function(result) {
			var res = JSON.parse(JSON.stringify(result));
			return res;
		});
	}

	updateMessageReadFlag(messageIds) {
		let ids = messageIds.toString();
		return this.privateMessageDAO.updateMessageReadFlagByIds(ids);
	}
}

module.exports = PrivateMessageServiceImpl;
