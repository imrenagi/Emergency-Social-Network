"use strict";

var PublicMessageDAO = require('./interfaces/publicMessageDAO');
var db = require('./db');

class PublicMessageDAOImpl extends PublicMessageDAO {
	constructor() {
		super();
	}

	searchByQuery(keywords, offset, limit) {
		var query = 'SELECT p.*, u.user_name from public_messages p left join users u on u.id = p.sender_id WHERE p.message like '; 
		var keyword;
		console.log(keywords);
		for(var i in keywords) {
			if(i == 0) {
				keyword = '\'%' + keywords[i] + '%\' ';
			}
			else {
				keyword = 'OR p.message like \'%' + keywords[i] + '%\' ';
			}
			query = query + keyword;
		}
		query = query + 'order by p.id desc limit ' + offset + ' , '+ limit;
		console.log(query);
		return new Promise(function(resovle, reject) {
			db.get().query(query, function(err, results) {
				if(err) {
					reject(err);
				}
				else {
					resovle(results);
				}
			});
		});
	}

}

module.exports = PublicMessageDAOImpl;