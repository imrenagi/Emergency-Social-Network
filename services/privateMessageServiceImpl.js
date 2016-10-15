"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var PrivateMessageService = require('./interfaces/privateMessageService');

var format = function(result) {
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

class PrivateMessageServiceImpl extends PrivateMessageService {
	constructor(privateMessageDAO) {
		super(privateMessageDAO);
	}

	getAllConversations(userId) {
		// return this.privateMessaegDAO.getAllConversatonsByUserId(userId).then(function(results) {
		// });
	}

	getAllPrivateMessages(conversationId, lastId, limit) {
		return this.privateMessageDAO.getPrivateMessagesByConversationId(conversationId, lastId, limit).then(function(results) {
			var res = JSON.parse(JSON.stringify(results));
			var json = R.map(result => format(result), res);
			var output = {
				messages : json
			}
			return output;
		});
	}
}

module.exports = PrivateMessageServiceImpl;