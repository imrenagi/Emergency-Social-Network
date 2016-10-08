"use strict";

var userDAO = require('./interfaces/userDAO');
var db = require('./db');

class userDAOImpl extends userDAO {
	constructor() {
		super();
	}

	// updateStatus(user, status) {
	// 	var query = 'UPDATE users SET status = ' + status + ', status_updated_at = now() WHERE id = ' + user.getId();
	// 	return new Promise(function(resolve, reject) {
	// 			db.get().query(query, function(err, result) {
	// 				if (err) reject(err)
	// 				else resolve(result)
	// 		})
	// 	});
	// }


	updateOnline(user, isOnline) {
		var query = 'UPDATE users SET online = ' + isOnline + ' WHERE id = ' + user.getId();
		return new Promise(function(resolve, reject) {
				db.get().query(query, function(err, result) {
					if (err) reject(err)
					else resolve(result)
			})
		});
	}

	updateStatus(userId, status) {
		var query = 'UPDATE users SET status = ' + status + ', status_updated_at = now() WHERE id = ' + userId;
		return new Promise(function(resolve, reject) {
				db.get().query(query, function(err, result) {
					if (err) {
						reject(err)
					}
					else resolve(result)
			})
		});
	}

	getUser(userId) {
		var query = 'SELECT * FROM users WHERE id = ' + userId;
		return new Promise(function(resolve, reject) {
				db.get().query(query, function(err, result) {
					if (err) {						
						reject(err)
					}
					else {
						var results = JSON.parse(JSON.stringify(result));
						resolve(results[0]);
					}
			})
		});
	}


	
}
module.exports = userDAOImpl;
