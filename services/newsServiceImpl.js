"use strict";

var R = require('ramda');
var dateHelper = require('../helpers/date');
var NewsService = require('./interfaces/newsService');
var Meta = require('../models/meta');


class NewsServiceImpl extends NewsService {
	constructor(newsDAO) {
		super(newDAO);
	}

	getAllNews() {

	}

	createNews() {
		
	}

}

module.exports = NewsServiceImpl;