"use strict";

class SearchService {
	constructor(userDAO, announcementDAO) {
		
		this.userDAO = userDAO
		this.announcementDAO = announcementDAO

	    if (this.userByName === undefined) {
	    	throw Error("Must override!");	
	    }

	    if (this.userByStatus === undefined) {
	    	throw Error("Must override!");	
	    }

	    if (this.announcementByQuery === undefined) {
	    	throw Error("Must override");
	    }
	}
}

module.exports = SearchService;