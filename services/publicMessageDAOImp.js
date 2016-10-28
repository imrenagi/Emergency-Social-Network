"use strict";

var PublicMessageDAO = require('./interfaces/publicMessageDAO');
var db = require('./db');

class PublicMessageDAOImpl extends PublicMessageDAO {
	constructor() {
		super();
	}

	searchByQuery(querys, offset, limit) {
		
	}

}

module.exports = PublicMessageDAOImpl;