"use strict";

var R = require('ramda');
var NewsDAO = require('./interfaces/newsDAO');

class NewsDAOImpl extends NewsDAO {
	constructor(db) {
		super(db);
	}

	getAll() {
		let query = 'SELECT n.*, u.user_name FROM news n left join users u on u.id = n.sender_id';
		let that = this;
		return new Promise(function(resolve, reject) {
			that.db.get().query(query, function(err, results) {
				if (err) {
					reject(err);
				}
				else {
					resolve(results);
				}
			});
		});
		
	}

	save(news) {

	}

}

module.exports = NewsDAOImpl;