"use strict";

var R = require('ramda');
var NewsDAO = require('./interfaces/newsDAO');

class NewsDAOImpl extends userDAO {
	constructor(db) {
		super(db);
	}

	getAll() {

	}

	save(news) {

	}

}

module.exports = NewsDAOImpl;