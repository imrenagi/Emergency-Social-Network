"use strict";

class NewsService {
	constructor(newsDAO, cloudImageService, userDAO) {
		this.newsDAO = newsDAO;
		this.cloudImageService = cloudImageService;
		this.userDAO = userDAO;
	}
	getAllNew() {}
	createNews() {}
	getNewsById(id) {}
}

module.exports = NewsService;