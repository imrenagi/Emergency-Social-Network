"use strict";

class AnnouncementDAO {
	constructor() {

	}
	
	save() {
		return new Error("Must override!");
	}

	getByAnnouncementId() {
		return new Error("Must override!");
	}
	
	findAll() {
		return new Error("Must override!");
	}
	
	searchByQuery() {
		return new Error("Must override!");
	}

}

module.exports = AnnouncementDAO;