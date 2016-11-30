"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var Location = require('../models/Location');
var NewsService = require('./interfaces/newsService');
var CloudImageServiceImpl = require('./cloudImageServiceImpl');
var distanceCalc = require('../helpers/distanceCalculator');

class NewsServiceImpl extends NewsService {
	constructor(newsDAO, cloudImageService, userDAO, emailSender) {
		super(newsDAO, cloudImageService, userDAO);
		this.sender = emailSender;
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
			return json;
		}).catch(function(err) {
			return err;
		});

	}

	getAllNews() {
		var that = this;
		return this.newsDAO.getAll().then(function(results) {
			var json = R.map(result => that.formatNews(result), results);
			return json;
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
			this.cloudImageService.cloudinaryConfig();
			return this.cloudImageService.uploadImage(picture).then(function(result) {
				image_url = result;
				var values = [senderId, title, content, latitude, longitude, status, image_url]; 

				that.sendEmailToUsersNearby(senderId, title, content, latitude, longitude, status, image_url);

				return that.newsDAO.save(values).then(function(results) {
					return results;
				}).catch(function(err) {
					return err;
				});
			}).catch(function(err) {
				return err;
			});
		}
		else {
			var values = [senderId, title, content, latitude, longitude, status, image_url]; 

			return this.newsDAO.save(values).then(function(results) {
				that.sendEmailToUsersNearby(senderId, title, content, latitude, longitude, status, image_url);
				return res;
			}).catch(function(err) {
				return err;
			});

		}
	}

	sendEmailToUsersNearby(senderId, title, content, latitude, longitude, status, image_url) {
		var eventLocation = new Location(parseFloat(latitude), parseFloat(longitude));
		var that = this;

		let subject = "Emergency News: "+ title;
		let shortMessage = "A citizen has reported " + content;
		let html = this.htmlText(content, image_url);

		this.userDAO.getUserEmailsWhoseValidLocation().then(res => {
			var emails = that.filteredEmails(eventLocation, res).join(",");
			console.log(emails);
			return that.sender.sendEmail(emails,
				subject,
				shortMessage,
				html)
		}).catch(err => {
			console.log("Failed to sending message")
		})
	}

	htmlText(content, imageUrl) {
		if (imageUrl === null) {
			return "Dear Citizen, <br> <br> A citizen has reported this information: <br> <br>" + content + 
		" <br><br> <a href=\"http://localhost:3000\">Check the latest update in Emergency Social Network here!</a> ";
		} else {
			return "Dear Citizen, <br> <br> A citizen has reported this information: <br> <br>" + content + 
		" <br><br> <img src=\""+ imageUrl +"\">" +
		" <br><br> <a href=\"http://localhost:3000\">Check the latest update in Emergency Social Network here!</a> ";
		}
	}

	filteredEmails(eventLocation, data) {
		var filteredEmails = [];
		for (var i in data) { 
			var loc = new Location(parseFloat(data[i].latitude), parseFloat(data[i].longitude));
			if (distanceCalc.isInRange(eventLocation, loc, 10)) filteredEmails.push(data[i].email);
		}
		return filteredEmails;
	}

}

module.exports = NewsServiceImpl;