"use strict";

var db = require('../services/db');
var User = require('../models/user');
var directoryService = require('./interfaces/directoryService');

// var sortDirectory = function(members) {
// 	return members;
// }

class directoryServiceImpl extends directoryService {

	constructor() {
		super();
	}

	// sortDirectory(members) {
	// 	//TODO: Sort the diercotry to alphabetical order, 
	// 	//starting with all the citizens who are online, and followed by all the citizens who are offline.
	// 	return members;
	// }

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
					members.sort();
					//members = sortDirectory(members);
					//TODO: Sort the diercotry, 
					//starting with all the citizens who are online, and followed by all the citizens who are offline.
					resolve(members);
				}
			})
		});
	}
}

module.exports = directoryServiceImpl;