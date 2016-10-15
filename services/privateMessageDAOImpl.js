"use strict";

var PrivateMessageDAO = require('./interfaces/privateMessageDAO');
var db = require('./db');

class PrivateMessageDAOImpl extends PrivateMessageDAO {
	constructor() {
		super();
	}

	getAllConversatonsByUserId(userId) {
		let query = 'SELECT id FROM conversations WHERE user2_id = ' + userId + ' OR user2_id = ' + userId;
		return new Promise(function(resolve, reject) {
			db.get().query(query, function(err, results) {
				if (err) reject(err);
				else resolve(results);
			})
		})
	}

	getMessagesByConversations(conversations) {
		var s = conversations.toString();
		//let query = 'SELECT id, conversatoin_id, sender_id, receiver_id, read_flag, (SELECT COUNT(*) FROM private_messages ) FROM private_messages WHERE conversatoin_id in (?)';
		let query = '';
		return new Promise(function(resolve, reject) {
			db.get().query(query, s, function(err, results) {
				if (err) reject(err);
				else resolve(results);
			})
		})
	}

	getPrivateMessagesByConversationId(conversationId, lastId, limit) {
		let query = '';
		if (lastId === -1) {
			query = 'SELECT p.*, u.user_name from private_messages p left join users u on u.id = p.sender_id WHERE p.conversation_id = ' + conversationId + ' order by p.id desc limit ' + limit;
		} else {
			query = 'SELECT p.*, u.user_name from private_messages p left join users u on u.id = p.sender_id WHERE p.conversation_id = ' + conversationId + ' AND where p.id >='+ (lastId-limit) + ' AND p.id < ' + lastId + ' order by p.id desc';
		}
		return new Promise(function(resolve, reject) {
			db.get().query(query, function(err, results) {
				if (err) {
					reject(err);
				}
				else {
					resolve(results);
				}
			})
		})
	}
}

module.exports = PrivateMessageDAOImpl;
