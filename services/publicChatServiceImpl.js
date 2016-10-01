"use strict";

var db = require('../services/db');
var User = require('../models/user');
var publicChatService = require('./interfaces/publicChatService');

class publicChatServiceImpl extends publicChatService {

	constructor() {
		super();
	}

}

module.exports = publicChatServiceImpl;
