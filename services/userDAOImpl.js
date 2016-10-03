"use strict";

var userDAO = require('./interfaces/userDAO');
var db = require('./db');

class userDAOImpl extends userDAO {
	constructor() {
		super();
	}

	updateOnline(user, isOnline) {
		var query = 'UPDATE users SET online = ' + isOnline + ' WHERE id = ' + user.getId();
		db.get().query(query, function(err, result) {
				if (err) {
					return console.log(err);
				}
			});
	}

	
}
module.exports = userDAOImpl;
