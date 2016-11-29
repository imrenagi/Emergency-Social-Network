"use strict";

class SearchService {
	constructor(userDAO, announcementDAO, publicMessageDAO, privateMessageDAO) {
		
		this.userDAO = userDAO;
		this.announcementDAO = announcementDAO;
		this.publicMessageDAO = publicMessageDAO;
		this.privateMessageDAO = privateMessageDAO;
	}
	userByName() {}
	userByStatus() {}
	announcementByQuery() {}
	publicMessageByQuery() {}
	privateMessageByQuery() {}
}

module.exports = SearchService;