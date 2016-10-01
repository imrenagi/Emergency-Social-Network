"use strict";

var db = require('../services/db');
var User = require('../models/user');
var publicChatService = require('./interfaces/publicChatService');

class publicChatServiceImpl extends publicChatService {

	constructor() {
		super();
	}

	getPreviousMessages() {
		return new Promise(function(resolve, reject) {
			db.get().query('SELECT * from public_messages', userName, function(err, result) {
				if (err) reject(err);
				else resolve(result);
			});
		});
	}
}

module.exports = publicChatServiceImpl;
