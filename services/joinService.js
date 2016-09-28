"use strict";

var db = require('../services/db');
var User = require('../models/user');

class JoinService {
	constructor() {}

	isValid(userName, password) {
		return true;
	}

	join(userName, password) {
		return new Promise(function(resolve, reject) {
			db.get().query('SELECT * from users where user_name=?', userName, function(err, result) {
				if (err) {
					reject(err);
				}
				else {
					var results = JSON.parse(JSON.stringify(result))
					if (results.length > 0) {
						if (results[0].password === password) {
							resolve({code : 200, 
								body: {
								id : results[0].id,
								user_name : results[0].user_name
							}});
						} else {
							resolve({code : 400, body: {}});
						}	
					} else {
						resolve({code : 204, body: {}});
					}
				}
			})
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

module.exports = JoinService;