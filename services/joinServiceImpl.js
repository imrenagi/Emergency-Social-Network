"use strict";

var db = require('../services/db');
var User = require('../models/user');
var encryptor = require('../helpers/passwordEncryptor');
var JoinService = require('./interfaces/joinService');
var userDAOImpl = require('./userDAOImpl');
var userDAO = new userDAOImpl();

const RESERVED_USERNAMES = require('../utils/reservedUsernames');

class JoinServiceImpl extends JoinService {
	constructor() {
		super();
	}

	isUserNameValid(userName) {
		if(userName.length < 3) {
			return false;
		}
		for (var i in RESERVED_USERNAMES) {
  			if(userName.toLowerCase() == RESERVED_USERNAMES[i]) {
				return false;
			}
		}
		return true;
	}

	isPasswordValid(password) {
		if(password.length < 4) {
			return false;
		}
		return true;
	}

	join(userName, password) {
		return new Promise(function(resolve, reject) {
			db.get().query('SELECT * from users where user_name=?', userName, function(err, result) {
				if (err) reject(err);
				else resolve(result);
			})
		}).then(result => {
			return new Promise(function(resolve, reject) {
				var results = JSON.parse(JSON.stringify(result));
				if (results.length > 0) {
					if (encryptor.compare(password, results[0].password)) {
						var user = new User(results[0].id, results[0].user_name, 
							results[0].online, results[0].status, results[0].privilage)
						userDAO.updateOnline(user, 1)
							.then(function(res) {
								user.online = 1;
								resolve({code : 200, body: user});
							}).catch(function(err) {
								resolve({code : 200, body: user});
							})
					} else {
						resolve({code : 400, body: {}});
					}	
				} else {
					resolve({code : 204, body: {}});
				}
			})
		})
	}

	confirm(userName, password) {
		return new Promise(function(resolve, reject) {
			let encryptedPassword = encryptor.createHash(password);
			let values = [userName, encryptedPassword];
			db.get().query('INSERT INTO users (user_name, password) values (?, ?);', values, function(err, result) {
				if (err) {
					reject(err);
				} else {
					var res = JSON.parse(JSON.stringify(result));
					var user = new User( res.insertId, userName, 0, 0, 0);
					userDAO.updateOnline(user, 1)
						.then(function(res) {
							user.online = 1;
							resolve(user);
						}).catch(function(err) {
							resolve(user);
						})
				}
			})
		});
	}
}

module.exports = JoinServiceImpl;
