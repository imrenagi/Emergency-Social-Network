'use strict';

var R = require('ramda');
var dateHelper = require('../helpers/date');
var AnnouncementService = require('./interfaces/announcementService');

var format = function(result) {
	var announcement = {
		id: result.id,
		sender: {
			id: result.sender_id,
			user_name: result.user_name
		},
		text: result.message,
		timestamp: dateHelper.convertDateToTimestamp(result.created_at),
		location: {
			lat: result.latitude,
			long: result.longitude
		}
	}
	return announcement;
}

class AnnouncementServiceImpl extends AnnouncementService {

	constructor(announcementDAO) {
		super(announcementDAO);
	}

	post(senderId, message, lat, long) {
		var announcement = {
			sender_id: senderId,
			message: message,
			lat: lat,
			long: long
		}
		return this.announcementDAO.save(announcement);
	}

	getByAnnouncementId(id) {
		return this.announcementDAO.getByAnnouncementId(id).then(function(result) {
			return format(result)
		});
	}

	getAllAnnouncements(lastId, limit) {
		return this.announcementDAO.findAll(lastId, limit).then(function(results) {
			var res = JSON.parse(JSON.stringify(results));
			var json = R.map(result => format(result), res);
			var output = {
				announcements : json
			}
			return output;
		})
	}


}

module.exports = AnnouncementServiceImpl;
