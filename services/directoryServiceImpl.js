"use strict";

var db = require('../services/db');
var User = require('../models/user');
var Meta = require('../models/meta');
var directoryService = require('./interfaces/directoryService');
var userDAOImpl = require('./userDAOImpl');
var userDAO = new userDAOImpl();
var dateHelper = require('../helpers/date');

class directoryServiceImpl extends directoryService {

	constructor() {
		super();
	}

	currentPage(page) {
		let currentPage = 1;
		if (page === 0 || page === 1) {
			currentPage = 1;
		} else {
			currentPage = page;
		}
		return currentPage;
	}

	offset(page, limit) {
		let offset = 0;
		if (page === 0 || page === 1) {
			offset = 0;
		} else {
			offset = (page - 1) * limit;
		}
		return offset;
	}

	getDirectory(page, limit) {
		let offset = 0;
		let currentPage = 1;
		if (page === 0 || page === 1) {
			offset = 0
			currentPage = 1;
		} else {
			offset = (page - 1) * limit
			currentPage = page;
		}
		
		return new Promise(function(resolve, reject) {
			db.get().query('select count(*) total_users from users', function(err, result) {
				if (err) {
					reject(err);
				}
				else {
					let res = JSON.parse(JSON.stringify(result[0]))
					let total_users = res.total_users;
					let meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(total_users/limit), total_users)
					resolve(meta);
				}
			})
		}).then(meta => {
			var query = 'select * from users where is_active = 1 ORDER BY `online` DESC, user_name ASC, id ASC limit ' + offset +','+limit;
			return new Promise(function(resolve, reject) {
				db.get().query(query, function(err, result) {
					if (err) reject(err);
					else {
						var members = [];
						var results = JSON.parse(JSON.stringify(result));
						for(var i in results) {
							var member = {id: results[i].id,
										user_name: results[i].user_name,
										online: results[i].online,
										status: results[i].status};
							members.push(member);
						}
						resolve({users: members, meta: meta});
					}
				})
			});
		});
	}

	getUser(id) {
		return new Promise(function(resolve, reject) {
			db.get().query('select * from users where id = ?', id, function(err, result) {
				if (err) reject(err)
				else {
					let rawUser = JSON.parse(JSON.stringify(result[0]));
					let user = new User(rawUser.id, rawUser.user_name, rawUser.online, rawUser.status);
					resolve(user);
				}
			})
		})
	}

	updateUserStatus(id, status, lat, long) {
		return userDAO.updateStatus(id, status, lat, long).then(function(results) {
			return userDAO.getUser(id).then(function(result) {
				var user = {
					id: result.id,
					user_name: result.user_name,
					online: result.online,
					status: result.status,
					location: {
						lat: result.latitude,
						long: result.longitude
					},
					status_updated_at: dateHelper.convertDateToTimestamp(result.status_updated_at)
				}
				return user;
			})
		});
	}

	getUsers(page, limit) {
		let offset = this.offset(page, limit);
		let currentPage = this.currentPage(page);
		return userDAO.getAllUsers(offset, limit).then(result => {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(result.total/limit), result.total);
			var results = result.data;
			var output = {
				users: results,
				meta: meta
			};		
			return output;
		}).catch(err => {
			return err;
		})
	}
}

module.exports = directoryServiceImpl;