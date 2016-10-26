"use strict";

var userDAO = require('./interfaces/userDAO');
var db = require('./db');

class userDAOImpl extends userDAO {
	constructor() {
		super();
	}

	//Add a comment
	updateOnline(user, isOnline) {
		var query = 'UPDATE users SET online = ' + isOnline + ' WHERE id = ' + user.getId();
		return new Promise(function(resolve, reject) {
				db.get().query(query, function(err, result) {
					if (err) reject(err)
					else resolve(result)
			})
		});
	}

	updateStatus(userId, status, lat, long) {
		let query = ''
		if (lat === undefined || long === undefined) {
			query = 'UPDATE users SET status = ' + status + ', status_updated_at = now() WHERE id = ' + userId;
		} else {
			query = 'UPDATE users SET status = ' + status + ', status_updated_at = now(), latitude = '+ lat +', longitude = '+long+' WHERE id = ' + userId;
		}
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

	searchByUserName(userName, offset, limit) {
		var query = 'select count(*) total from users u where u.user_name like \'%' + userName + '%\''
		return new Promise(function(resolve, reject) {
			db.get().query(query, function(err, result) {
				if (err) {
					reject(err);
				}
				else {
					let total_results = JSON.parse(JSON.stringify(result[0])).total;
					resolve(total_results);
				}
			})
		}).then(total_result => {
			var query2 = 'select u.id, u.user_name, u.online, u.status from users u where u.user_name like \'%' + userName + '%\' order by online desc, user_name asc limit '+offset +','+limit+';'
			return new Promise(function(resolve, reject) {
					db.get().query(query2, function(err, result) {
						if (err) {					
							reject(err)
						}
						else {
							var results = {
								data: JSON.parse(JSON.stringify(result)),
								total: total_result
							}
							resolve(results);
						}
				})
			})
		});
	}

}
module.exports = userDAOImpl;
