"use strict";

class SearchService {
	constructor(userDAO, announcementDAO, publicMessageDAO, privateMessageDAO) {
		
		this.userDAO = userDAO;
		this.announcementDAO = announcementDAO;
		this.publicMessageDAO = publicMessageDAO;
		this.privateMessageDAO = privateMessageDAO;

	    if (this.userByName === undefined) {
	    	throw Error("Must override!");	
	    }

	    if (this.userByStatus === undefined) {
	    	throw Error("Must override!");	
	    }

	    if (this.announcementByQuery === undefined) {
	    	throw Error("Must override!");
	    }

	    if (this.publicMessageByQuery === undefined) {
	    	throw Error("Must override!");
	    }

	    if (this.privateMessageByQuery === undefined) {
	    	throw Error("Must override!");
	    }
	}
}

module.exports = SearchService;