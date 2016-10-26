"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var SearchService = require('./interfaces/searchService');
var Meta = require('../models/Meta')

class SearchServiceImpl extends SearchService {
	constructor(userDAO) {
		super(userDAO);
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
	
}

module.exports = SearchServiceImpl;
