"use strict";

var db = require('../services/db');
var User = require('../models/user');
var dirService = require('./interfaces/directoryService');

class directoryServiceImpl extends dirService {

	constructor() {
		super();
	}

	sortDirectory(members) {
		//TODO: Sort the diercotry to alphabetical order, 
		//starting with all the citizens who are online, and followed by all the citizens who are offline.
		return members
	}

	getDirectory() {
		return new Promise(function(resolve, reject) {
			db.get().query('SELECT * from users', function(err, result) {
				if (err) reject(err);
				else {
					var members = [];
					var results = JSON.parse(JSON.stringify(result));
					for(var i in results) {
						members.push(results[i].user_name);
					}

					resolve(members);
				}
			})
		});
	}
}

module.exports = directoryServiceImpl;