"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var SearchService = require('./interfaces/searchService');
var Meta = require('../models/meta')

const STOPWORDS = require('../utils/stopwords');

class SearchServiceImpl extends SearchService {
	constructor(userDAO, announcementDAO) {
		super(userDAO, announcementDAO);
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
		var that = this;
		if (this.doesContainOnlyStopWord(query)) {
			return Promise.resolve({
				results: [],
				meta: new Meta(parseInt(currentPage), parseInt(limit), 0, 0)
			})
		}
		return this.announcementDAO.searchByQuery(query, offset, limit).then(result => {
			var meta = new Meta(parseInt(currentPage), parseInt(limit), Math.ceil(result.total/limit), result.total)
			var results = R.map(result => that.formatAnnouncement(result), result.data);
			var output = {
				results: results,
				meta: meta
			}		
			return output
		}).catch(err => {
			return err
		})
	}

	publicMessageByQuery(query, page, limit) {
		
	}

	doesContainOnlyStopWord(query) {
		//TODO implement this function!
		return false;
	}
	
}

module.exports = SearchServiceImpl;
