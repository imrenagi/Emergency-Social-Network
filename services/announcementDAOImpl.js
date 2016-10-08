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
			values = [senderId, message, lat, long];
			query = 'INSERT INTO announcements (sender_id, message, latitude, longitude) values (?,?,?,?)';
		} else {
			values = [senderId, message];
			query = 'INSERT INTO announcements (sender_id, message) values (?,?)';
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
		let query = 'SELECT a.*, u.user_name from announcements a where id = ? left join users u';
		return new Promise(function(resolve, reject) {
			db.get().query(query, id, function(err, results) {
				if(err) reject(err);
				else {
					var announcement = JSON.stringify(results[0]);
					resolve(announcement);
				}
			});
		})
	}


}

module.exports = AnnouncementDAOImpl;
