"use strict";

var db = require('../services/db');
var User = require('../models/user');
var directoryService = require('./interfaces/directoryService');

class directoryServiceImpl extends directoryService {

	constructor() {
		super();
		this.member;
	}

	getDirectory() {
		return new Promise(function(resolve, reject) {
			db.get().query('SELECT * from users', function(err, result) {
				if (err) reject(err);
				else {
					var members = [];
					var results = JSON.parse(JSON.stringify(result));
					for(var i in results) {
						var member = {user_name: results[i].user_name,
									online: results[i].online};
						members.push(member);
					}
					//Sort the diercotry to alphabetical order, 
					//starting with all the citizens who are online, and followed by all the citizens who are offline.
					members.sort(function(a, b) {
						if(a.online < b.online) return 1;
						else if(a.online > b.online) return -1;
						else {
							if (a.user_name < b.user_name) return -1;
							else if(a.user_name > b.user_name) return 1;
							return 0;
						}
					});
					resolve(members);
				}
			})
		});
	}
}

module.exports = directoryServiceImpl;