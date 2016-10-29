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
		console.log(conversations);
		if(conversations.length === 0) {
			return Promise.resolve([]);
		}
		let query = 'SELECT conversation_id, sender_id, receiver_id, sender_name, receiver_name, COUNT(IF (read_flag = 0, read_flag, null) ) AS unread_count FROM private_messages where conversation_id in (' + conversations +') group by conversation_id';
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
		var query = 'SELECT p.*, u.user_name from private_messages p left join users u on u.id = p.sender_id WHERE p.conversation_id = ' + conversationId + ' order by p.id desc';
		return new Promise(function(resolve, reject) {
			db.get().query(query, function(err, results) {
				if (err) {
					console.log(err);
					reject(err);
				}
				else {
					console.log(results);
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

	updateMessageReadFlagByIds(ids) {
		return new Promise(function(resolve, reject) {
			let query = 'UPDATE private_messages SET read_flag = 1 WHERE id in (' + ids + ')';
			db.get().query(query, function(err, result) {
				if(err) {
					console.log(err);
					reject(err);
				}
				else {
					console.log(result);
					resolve(result);
				}
			});
		});
	}

	searchByQuery(userId, keywords, offset, limit) {
		var paginationQuery = 'SELECT count(*) total from private_messages p WHERE ( p.message like ';
		var query = 'SELECT p.* from private_messages p WHERE ( p.message like '; 
		var keyword;
		console.log(keywords);
		for(var i in keywords) {
			if(i === 0) {
				keyword = '\'%' + keywords[i] + '%\' ';
			}
			else {
				keyword = 'OR p.message like \'%' + keywords[i] + '%\' ';
			}
			paginationQuery = paginationQuery + keyword;
			query = query + keyword;
		}
		paginationQuery = paginationQuery + ') AND (sender_id = ' + userId + ' OR  receiver_id = ' + userId + ' )';
		query = query + ') AND (sender_id = ' + userId + ' OR  receiver_id = ' + userId + ' ) order by p.id desc limit ' + offset + ' , '+ limit;

		return new Promise(function(resovle, reject) {
			db.get().query(paginationQuery, function(err, result) {
				if(err) {
					reject(err);
				}
				else {
					let total_count = JSON.parse(JSON.stringify(result[0])).total;
					resovle(total_count);
				}
			});
		}).then(function(total_count) {
			return new Promise(function(resovle, reject) {
				db.get().query(query, function(err, results) {
					if(err) {
						reject(err);
					}
					else {
						var json = {
							data: JSON.parse(JSON.stringify(results)),
							total: total_count
						};
						resovle(json);
					}
				});
			});
		});
	}

}

module.exports = PrivateMessageDAOImpl;
