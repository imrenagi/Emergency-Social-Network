"use strict";

var R = require('ramda');
var userDAO = require('./interfaces/userDAO');
// var db = require('./db');

class userDAOImpl extends userDAO {
	constructor(db) {
		super();
		this.db = db;
	}

	//Add a comment	
	updateOnline(user, isOnline) {
		var that = this;
		var query = 'UPDATE users SET online = ' + isOnline + ' WHERE id = ' + user.getId();
		return new Promise(function(resolve, reject) {
				that.db.get().query(query, function(err, result) {
					if (err) {
						reject(err)
					}
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
		var that = this;
		return new Promise(function(resolve, reject) {
				that.db.get().query(query, function(err, result) {
					if (err) reject(err)
					else resolve(result)
			})
		});
	}

	getUser(userId) {
		var query = 'SELECT * FROM users WHERE id = ' + userId;
		var that = this;
		return new Promise(function(resolve, reject) {
				that.db.get().query(query, function(err, result) {
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
		var paginationQuery = 'select count(*) total from users u where u.user_name like \'%' + userName + '%\''
		var itemQuery = 'select u.id, u.user_name, u.online, u.status from users u where u.user_name like \'%' + userName + '%\' order by online desc, user_name asc limit '+offset +','+limit+';'
		return this.searchByQuery(paginationQuery, itemQuery)
	}

	searchByStatus(status, offset, limit) {
		var paginationQuery = 'select count(*) total from users u where u.status = ' + status + ';'
		var itemQuery = 'select u.id, u.user_name, u.online, u.status from users u where u.status = ' + status + ' order by online desc, user_name asc limit '+offset +','+limit+';'
		return this.searchByQuery(paginationQuery, itemQuery, offset, limit);
	}

	searchByQuery(paginationQuery, itemQuery, offset, limit) {
		var that = this;
		return new Promise(function(resolve, reject) {
			that.db.get().query(paginationQuery, function(err, result) {
				if (err) {
					reject(err);
				}
				else {
					let total_results = JSON.parse(JSON.stringify(result[0])).total;
					resolve(total_results);
				}
			})
		}).then(total_result => {
			return new Promise(function(resolve, reject) {
					that.db.get().query(itemQuery, function(err, result) {
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

	getAllUsers(offset, limit) {
		var paginationQuery = 'select count(*) total from users u ;';
		var itemQuery = 'select u.id, u.user_name, u.is_active, u.privilage from users u limit '+offset +','+limit+';'
		var that = this;
		return new Promise(function(resolve, reject) {
			that.db.get().query(paginationQuery, function(err, result) {
				if (err) {
					reject(err);
				} else {
					let total_results = JSON.parse(JSON.stringify(result[0])).total;
					resolve(total_results);
				}
			})
		}).then(total_result => {			
			return new Promise(function(resolve, reject) {
					that.db.get().query(itemQuery, function(err, result) {
						if (err) {					
							reject(err)
						}
						else {
							var res = JSON.parse(JSON.stringify(result));
							var addedAsterixPassResult = R.map(r => { 
								r.password = "***********";
								return r; 
							}, res);
							var results = {
								data: addedAsterixPassResult,
								total: total_result
							}
							resolve(results);
						}
				})
			})
		});
	}

	updateUser(id, values) {
		let query = 'UPDATE users SET user_name = ?, is_active = ?, privilage = ?, password = ? WHERE id = ' + id;
		var that = this;
		return new Promise(function(resolve, reject) {
			that.db.get().query(query, values, function(err, result) {
				if (err) {
					reject(err);
				}
				else {
					resolve(result);
				}
			});
		})
	}

	updateUserWithoutPassword(id, values) {
		let query = 'UPDATE users SET user_name = ?, is_active = ?, privilage = ? WHERE id = ' + id;
		var that = this;
		return new Promise(function(resolve, reject) {
			that.db.get().query(query, values, function(err, result) {
				if (err) {
					reject(err);
				}
				else {
					resolve(result);
				}
			});
		})
	}

	updateUserLocation(id, lat, long) {
		let query = 'UPDATE users SET latitude = ?, longitude = ? WHERE id = ' + id;
		let values = [lat, long];
		var that = this;
		return new Promise(function(resolve, reject) {
			that.db.get().query(query, values, function(err, result) {
				if (err) reject(err);
				else resolve(result);
			})
		})
	}

	getUserEmailsWhoseValidLocation() {
		let query = 'select latitude, longitude, email from users where latitude is not null and longitude is not null and email is not null and is_active = 1;'
		var that = this;
		return new Promise(function(resolve, reject) {
			that.db.get().query(query, function(err, result) {
				if (err) reject(err);
				else resolve(JSON.parse(JSON.stringify(result)));
			})
		})
	}
}

module.exports = userDAOImpl;
