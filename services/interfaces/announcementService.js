"use strict";

class announcementService {

	constructor(announcementDAO) {
		this.announcementDAO = announcementDAO;

		if(this.post === undefined) {
			throw("Must override!");
		}

	}
}

module.exports = announcementService;
