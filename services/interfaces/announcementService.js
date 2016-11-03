"use strict";

class announcementService {

	constructor(announcementDAO) {
		this.announcementDAO = announcementDAO;
	}

	post() {
		return new Error("Must override!");
	}
	
	getAllAnnouncements() {
		return new Error("Must override!");
	}
	
	getByAnnouncementId() {
		return new Error("Must override!");
	}
	
}

module.exports = announcementService;
