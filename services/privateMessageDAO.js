"use strict";

var PrivateMessageDAO = require('./interfaces/announcementDAO');
var db = require('./db');

class PrivateMessageDAOImpl extends PrivateMessageDAO {
	constructor() {
		super();
	}
}

module.exports = PrivateMessageDAOImpl;
