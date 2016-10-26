"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var SearchService = require('./interfaces/searchService');

class SearchServiceImpl extends SearchService {
	constructor(userDAO) {
		super(userDAO);
	}

	userByName(userName) {
		return this.userDAO.searchByUserName(userName)
	}
}

module.exports = SearchServiceImpl;
