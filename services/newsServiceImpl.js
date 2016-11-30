"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var NewsService = require('./interfaces/newsService');
var CloudImageServiceImpl = require('./cloudImageServiceImpl');

var cloudImageService = new CloudImageServiceImpl();

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
			var output = { json };
			return output;
		}).catch(function(err) {
			return err;
		});

	}

	getAllNews() {
		var that = this;
		return this.newsDAO.getAll().then(function(results) {
			var json = R.map(result => that.formatNews(result), results);
			var output = { json };
			return output;
		}).catch(function(err) {
			return err;
		});
	}

	createNews(news) {
		var that = this;
		var senderId = news.reporter_id;
		var title = news.title;
		var content = news.message;
		var latitude = news.lat || null;
		var longitude = news.long || null;
		var status = news.status || 0;
		var picture = news.image_binary || null;

		var image_url = null;
		
		if (picture != null) {
			console.log('hello');
			console.log(picture);
			cloudImageService.cloudinaryConfig();
			cloudImageService.uploadImage(picture).then(function(result) {
				image_url = result;

				console.log('hello');

				console.log('url is' + image_url);
				var values = [senderId, title, content, latitude, longitude, status, image_url]; 
				return that.newsDAO.save(values).then(function(results) {
					return results;
				}).catch(function(err) {
					console.log(err);
					return err;
				});
			}).catch(function(err) {
				console.log(err);
			});
		}
		else {
			var values = [senderId, title, content, latitude, longitude, status, image_url]; 
			return this.newsDAO.save(values).then(function(results) {
				return results;
			}).catch(function(err) {
				console.log(err);
				return err;
			});

		}
		//image_url = "test";
	}

}

module.exports = NewsServiceImpl;