"use strict";

class AnnouncementDAO {
	constructor() {
		if(this.save === undefined) {
			throw Error("Must override!");
		}
		if(this.getByAnnouncementId === undefined) {
			throw Error("Must override!");
		}
		if(this.findAll === undefined) {
			throw Error("Must override!");
		}
		if(this.searchByQuery === undefined) {
			throw Error("Must override!");
		}
		
	}
}

module.exports = AnnouncementDAO;