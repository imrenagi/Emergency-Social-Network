"use strict";

var PrivateMessageDAO = require('./interfaces/privateMessageDAO');
var db = require('./db');

class PrivateMessageDAOImpl extends PrivateMessageDAO {
	constructor() {
		super();
	}

	getAllConversatonsByUserId(userId) {
		let query = 'SELECT id FROM conversations WHERE user1_id = ' + userId + ' OR user2_id = ' + userId;
		return new Promise(function(resolve, reject) {
			db.get().query(query, function(err, results) {
				if (err) reject(err);
				else {
					resolve(results);
				}
			});
		});
	}

	getMessagesByConversations(userId, conversations) {
		if(conversations.length == 0) {
			return Promise.resolve([]);
		}
		let query = 'SELECT conversation_id, sender_id, receiver_id, sender_name, receiver_name, COUNT(*) AS unread_count FROM private_messages WHERE conversation_id in (' + conversations+ ') AND read_flag = 0 group by conversation_id';
		console.log(query);
		return new Promise(function(resolve, reject) {
			db.get().query(query, function(err, results) {
				if (err) reject(err);
				else {
					resolve(results);
				}
			})
		})
	}

	getPrivateMessagesByConversationId(conversationId, lastId, limit) {
		var query = '';
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

	createConversation(user1, user2) {
		let values = [user1, user2];
		let query = 'INSERT INTO conversations (user1_id, user2_id) values (?, ?)';
		return new Promise(function(resolve, reject) {
			db.get().query(query, values, function(err, results) {
				if(err) {
					reject(err);
				}
				else {
					resolve(results.insertId);
				}
			});
		});
	}

	storePrivateMessage(values) {
		console.log(values);
		let query = 
		'INSERT INTO private_messages (sender_id, sender_name, receiver_id, receiver_name, conversation_id, message, message_status, latitude, longitude, read_flag) values (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
		return new Promise(function(resolve, reject) {
			db.get().query(query, values, function(err, results) {
				if(err) {
					console.log(err);
					reject(err);
				}
				else {
					resolve(results.insertId);
				}
			});
		}).then(function(result) {
			return new Promise(function(resolve, reject) {
				let query = 'SELECT * FROM private_messages WHERE id = ?';
				console.log(result);
				db.get().query(query, result, function(err, results) {
					if(err) {
						console.log(err);
						reject(err);
					}
					else {
						resolve(results[0]);
					}
				});
			});
			
		});
	}

	getConversationId(senderId, receiverId) {
		return new Promise(function(resolve, reject) {
			let query = 'SELECT id FROM conversations WHERE (user1_id = ' + senderId + ' AND user2_id = ' + receiverId + 
			') OR (user1_id = ' + receiverId + ' AND user2_id = ' + senderId + ')';
			console.log(query);
			db.get().query(query, function(err, results) {
				if(err) {
					console.log(err);
					reject(err);
				}
				else {
					resolve(results);
				}
			});
		})
	}

}

module.exports = PrivateMessageDAOImpl;
