'use strict';

var R = require('ramda');
var dateHelper = require('../helpers/date');
var AnnouncementService = require('./interfaces/announcementService');

class AnnouncementServiceImpl extends AnnouncementService {

	constructor(announcementDAO) {
		super(announcementDAO);
	}

	format(result) {
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
		var that = this;
		return this.announcementDAO.getByAnnouncementId(id).then(function(result) {
			return that.format(result)
		});
	}

	getAllAnnouncements(lastId, limit) {
		var that = this;
		return this.announcementDAO.findAll(lastId, limit).then(function(results) {
			var res = JSON.parse(JSON.stringify(results));
			var json = R.map(result => that.format(result), res);
			var output = {
				announcements : json
			}
			return output;
		})
	}


}

module.exports = AnnouncementServiceImpl;
