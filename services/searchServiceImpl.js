"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var SearchService = require('./interfaces/searchService');
var Meta = require('../models/meta');

const STOPWORDS = require('../utils/stopwords');

class SearchServiceImpl extends SearchService {
	constructor(userDAO, announcementDAO, publicMessageDAO, privateMessageDAO) {
		super(userDAO, announcementDAO, publicMessageDAO, privateMessageDAO);
	}

	currentPage(page) {
		let currentPage = 1;
		if (page === 0 || page === 1) {
			currentPage = 1;
		} else {
			currentPage = page;
		}
		return currentPage
	}

	offset(page, limit) {
		let offset = 0;
		if (page === 0 || page === 1) {
			offset = 0
		} else {
			offset = (page - 1) * limit
		}
		return offset;
	}

	userByName(userName, page, limit) {
		let offset = this.offset(page, limit);
		let currentPage = this.currentPage(page);
		return this.userDAO.searchByUserName(userName, offset, limit).then(result => {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(result.total/limit), result.total)
			var results = result.data
			var output = {
				results: results,
				meta: meta
			}		
			return output
		}).catch(err => {
			return err
		})
	}

	userByStatus(status, page, limit) {
		let offset = this.offset(page, limit);
		let currentPage = this.currentPage(page);
		return this.userDAO.searchByStatus(status, offset, limit).then(result => {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(result.total/limit), result.total)
			var results = result.data
			var output = {
				results: results,
				meta: meta
			}		
			return output
		}).catch(err => {
			return err
		})
	}

	formatAnnouncement(result) {
		var announcement = {
			id: result.id,
			sender: {
				id: result.sender_id,
				user_name: result.user_name
			},
			text: result.message,
			timestamp: dateHelper.convertDateToTimestamp(result.created_at),
			location: {
				lat: result.latitude,
				long: result.longitude
			}
		}
		return announcement;
	}

	announcementByQuery(query, page, limit) {
		let offset = this.offset(page, limit);
		let currentPage = this.currentPage(page);
		var querys = this.searchQueryFilter(query);

		if(querys.length === 0) {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(0/limit), 0);
			return Promise.resolve({
				results: [],
				meta: meta
			});
		}
		var that = this;
		return this.announcementDAO.searchByQuery(querys, offset, limit).then(function(results) {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(results.total/limit), results.total);
			var json = R.map(result => that.formatAnnouncement(result), results.data);
			var output = { results: json,
						   meta: meta
						 };
			return output;
		}).catch(function(err) {
			return err;
		});
	}

	publicMessageByQuery(query, page, limit) {
		let offset = this.offset(page, limit);
		let currentPage = this.currentPage(page);

		var querys = this.searchQueryFilter(query);
		if(querys.length === 0) {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(0/limit), 0);
			return Promise.resolve({
				results: [],
				meta: meta
			});
		}
		var that = this;
		return this.publicMessageDAO.searchByQuery(querys, offset, limit).then(function(results) {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(results.total/limit), results.total)
			var json = R.map(result => that.formatMessage(result), results.data);
			var output = { results: json,
						   meta: meta
						 };
			return output;
		}).catch(function(err) {
			return err;
		});

	}

	privateMessageByQuery(userId, query, page, limit) {
		let offset = this.offset(page, limit);
		let currentPage = this.currentPage(page);

		var querys = this.searchQueryFilter(query);	
		if(querys.length === 0) {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(0/limit), 0);
			return Promise.resolve({
				results: [],
				meta: meta
			});
		}
		var that = this;
		return this.privateMessageDAO.searchByQuery(userId, querys, offset, limit).then(function(results) {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(results.total/limit), results.total)
			var json = R.map(result => that.formatMessage(result), results.data);
			var output = {
				results : json,
				meta: meta
			}
			return output;
		}).catch(function(err) {
			return err;
		});
	}

	searchQueryFilter(query) {
		query = query.replace(/\W+/g, ' ');
		var querys = query.split(" ");
		for(var i in STOPWORDS) {
			for(var j in querys) {
				if(querys[j].toLowerCase() === STOPWORDS[i] || querys[j].toLowerCase() === '') {
					querys.splice(j, 1);
				}
			}
		}
		return querys;
	}

	formatMessage(result) {
		var message = {
			id: result.id,
			sender: {
				id: result.sender_id,
				user_name: result.user_name
			},
			text: result.message,
			timestamp: dateHelper.convertDateToTimestamp(result.created_at),
			status: result.message_status,
			location: {
				lat: result.latitude,
				long: result.longitude
			}
		}
		return message;
	}
	
}

module.exports = SearchServiceImpl;
