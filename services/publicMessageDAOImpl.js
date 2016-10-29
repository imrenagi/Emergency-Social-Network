"use strict";

var PublicMessageDAO = require('./interfaces/publicMessageDAO');
var db = require('./db');

class PublicMessageDAOImpl extends PublicMessageDAO {
	constructor() {
		super();
	}

	searchByQuery(keywords, offset, limit) {
		var paginationQuery = 'SELECT count(*) total from public_messages p WHERE p.message like ';
		var query = 'SELECT p.*, u.user_name from public_messages p left join users u on u.id = p.sender_id WHERE p.message like '; 
		var keyword;
		for(var i in keywords) {
			if(i == 0) {
				keyword = '\'%' + keywords[i] + '%\' ';
			}
			else {
				keyword = 'OR p.message like \'%' + keywords[i] + '%\' ';
			}
			query = query + keyword;
			paginationQuery = paginationQuery + keyword;
		}
		query = query + 'order by p.id desc limit ' + offset + ' , '+ limit;
		console.log(paginationQuery);
		console.log(query);
		return new Promise(function(resovle, reject) {
			db.get().query(paginationQuery, function(err, result) {
				if(err) {
					console.log(err);
					reject(err);
				}
				else {
					let total_count = JSON.parse(JSON.stringify(result[0])).total;
					resovle(total_count);
				}
			});
		}).then(function(total_count) {
			return new Promise(function(resovle, reject) {
				db.get().query(query, function(err, results) {
					if(err) {
						reject(err);
					}
					else {
						var json = {
							data: JSON.parse(JSON.stringify(results)),
							total: total_count
						};
						resovle(json);
					}
				});
			});
		});

		// return new Promise(function(resovle, reject) {
		// 	db.get().query(query, function(err, results) {
		// 		if(err) {
		// 			reject(err);
		// 		}
		// 		else {
		// 			resovle(results);
		// 		}
		// 	});
		// });
	}

}

module.exports = PublicMessageDAOImpl;