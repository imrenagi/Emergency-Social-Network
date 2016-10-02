"use strict";

var db = require('../services/db');
var User = require('../models/user');
var directoryService = require('./interfaces/directoryService');

class directoryServiceImpl extends directoryService {

	constructor() {
		super();
	}

	getDirectory(page, limit) {
		let offset = 0;
		if (page === 0 || page === 1) {
			offset = 0
		} else {
			offset = (page - 1) * limit
		}
		var query = 'select * from users ORDER BY  `online` DESC, user_name ASC, id ASC limit ' + offset +','+limit;
		return new Promise(function(resolve, reject) {
			db.get().query(query, function(err, result) {
				if (err) reject(err);
				else {
					var members = [];
					var results = JSON.parse(JSON.stringify(result));
					for(var i in results) {
						var member = {id: results[i].id,
									user_name: results[i].user_name,
									online: results[i].online};
						members.push(member);
					}
					resolve({users: members});
				}
			})
		});
	}
}

module.exports = directoryServiceImpl;