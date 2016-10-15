"use strict";

var PrivateMessageService = require('./interfaces/privateMessageService');

class PrivateMessageServiceImpl extends PrivateMessageService {
	constructor(privateMessaegDAO) {
		super(privateMessaegDAO);
	}
}

module.exports = PrivateMessageServiceImpl;