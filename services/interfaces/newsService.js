"use strict";

class NewsService {
	constructor(newsDAO, cloudImageService) {
		this.newsDAO = newsDAO;
		this.cloudImageService = cloudImageService;
	}
	getAllNew() {}
	createNews() {}
	getNewsById(id) {}
}

module.exports = NewsService;