"use strict";

var db = require('../services/db');
var User = require('../models/user');
var JoinService = require('./interfaces/JoinService');
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
  			if(userName == RESERVED_USERNAMES[i]) {
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
					if (results[0].password === password) {
						var user = new User(results[0].id, results[0].user_name);
						resolve({code : 200, body: user});
					} else {
						resolve({code : 400, body: {}});
					}	
				} else {
					resolve({code : 204, body: {}});
				}
			});
		});
	}

	confirm(userName, password) {
		return new Promise(function(resolve, reject) {
			var values = [userName, password];
			db.get().query('INSERT INTO users (user_name, password) values (?, ?);', values, function(err, result) {
				if (err) {
					reject(err);
				} else {
					var res = JSON.parse(JSON.stringify(result));
					var user = new User(res.insertId, userName);
					resolve(user);
				}
			})
		});
	}
}

module.exports = JoinServiceImpl;