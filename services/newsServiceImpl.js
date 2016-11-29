"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var NewsService = require('./interfaces/newsService');

class NewsServiceImpl extends NewsService {
	constructor(newsDAO) {
		super(newsDAO);
	}

	formatNews(data) {
		var news = {
			id: data.id,
			reporter: {
				id: data.sender_id,
				user_name: data.user_name
			},
			timestamp: dateHelper.convertDateToTimestamp(data.created_at),
			status: data.status,
			location: {
				lat: data.latitude,
				long: data.longitude
			},
			title: data.title,
			message: data.content,
			image_url: data.picture
		}
		return news;
	}
	
	getNewsById(id) {
		var that = this;
		return this.newsDAO.getById(id).then(function(results) {
			var json = R.map(result => that.formatNews(result), results);
			var output = { news: json };
			return output;
		}).catch(function(err) {
			return err;
		});

	}

	getAllNews() {
		var that = this;
		return this.newsDAO.getAll().then(function(results) {
			var json = R.map(result => that.formatNews(result), results);
			var output = { news: json };
			return output;
		}).catch(function(err) {
			return err;
		});
	}

	createNews() {

	}

}

module.exports = NewsServiceImpl;