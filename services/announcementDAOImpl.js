"use strict";

var AnnouncementDAO = require('./interfaces/announcementDAO');
var db = require('./db');

class AnnouncementDAOImpl extends AnnouncementDAO {
	constructor() {
		super();
	}

	save(announcement) {
		var senderId = announcement.sender_id;
		var message = announcement.message;
		var lat = announcement.lat;
		var long = announcement.long;

		var values = []; 
		let query = ''
		if (lat === undefined || long === undefined) {
			values = [senderId, message];
			query = 'INSERT INTO announcements (sender_id, message) values (?,?)';
		} else {
			values = [senderId, message, lat, long];
			query = 'INSERT INTO announcements (sender_id, message, latitude, longitude) values (?,?,?,?)';
		}
		return new Promise(function(resolve, reject) {
			db.get().query(query, values, function(err, result) {
				if(err) {
					reject(err);
				}
				else {
					resolve(result.insertId);
				}
			});
		});
		
	}

	getByAnnouncementId(id) {
		let query = 'SELECT a.*, u.user_name from announcements a left join users u on u.id = a.sender_id where a.id = ?';
		return new Promise(function(resolve, reject) {
			db.get().query(query, id, function(err, results) {
				if(err) reject(err);
				else resolve(results[0]);
			});
		})
	}

	findAll(lastId, limit) {
		let query = '';
		if (lastId === -1) {
			query = 'SELECT a.*, u.user_name from announcements a left join users u on u.id = a.sender_id order by a.id desc limit ' + limit;
		} else {
			query = 'SELECT a.*, u.user_name from announcements a left join users u on u.id = a.sender_id where a.id >='+ (lastId-limit) + ' and a.id < ' + lastId + ' order by a.id desc';
		}
		return new Promise(function(resolve, reject) {
			db.get().query(query, function(err, results) {
				if (err) reject(err);
				else resolve(results);
			})
		})
	}


}

module.exports = AnnouncementDAOImpl;