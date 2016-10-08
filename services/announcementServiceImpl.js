'use strict';

var dateHelper = require('../helpers/date');
var AnnouncementService = require('./interfaces/announcementService');

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
		return announcementDAO.save(announcement);
	}

	getByAnnouncementId(id) {
		return announcementDAO.getByAnnouncementId(id).then(function(result) {
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
					long: result.longtitude
				}
			}
			return announcement;
		});
	}


}

module.exports = AnnouncementServiceImpl;