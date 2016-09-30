"use strict";

var db = require('../services/db');
var PublicMessageService = require('./interfaces/publicMessageService');

class PublicMessageServiceImpl extends PublicMessageService {
	constructor() {
		super();
	}

	getAllMessages(page, limit) {
		return new Promise().resolve("asdasd");
	}

}

