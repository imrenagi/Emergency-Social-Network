"use strict";

class announcementService {

	constructor(announcementDAO) {
		this.announcementDAO = announcementDAO;

		if(this.post === undefined) {
			throw("Must override!");
		}
		if(this.getAllAnnouncements === undefined) {
			throw("Must override!");
		}
		if(this.getByAnnouncementId === undefined) {
			throw Error("Must override!");
		}
	}
}

module.exports = announcementService;
