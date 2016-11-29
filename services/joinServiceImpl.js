"use strict";

var db = require('../services/db');
var User = require('../models/user');
var encryptor = require('../helpers/passwordEncryptor');
var JoinService = require('./interfaces/joinService');
var userValidator = require('../utils/userValidator');

var userDAOImpl = require('./userDAOImpl');
var userDAO = new userDAOImpl(db);

const RESERVED_USERNAMES = require('../utils/reservedUsernames');

class JoinServiceImpl extends JoinService {
	constructor() {
		super();
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

	confirm(userName, password, email) {
		return new Promise(function(resolve, reject) {
			let encryptedPassword = encryptor.createHash(password);
			let values = [userName, encryptedPassword];
			let q = "INSERT INTO users (user_name, password) values ('"+userName +"', '"+encryptedPassword+"');"
			if (email !== undefined && email !== '') {
				q = "INSERT INTO users (user_name, password, email) values ('"+userName +"', '"+encryptedPassword+"', '"+email+"');"
			}
			db.get().query(q, function(err, result) {
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
