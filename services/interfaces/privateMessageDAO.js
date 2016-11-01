"use strict";

class PrivateMessageDAO {
	constructor() {
	}

	getAllConversatonsByUserId() {
		return new Error("Must override!");
	}

	getPrivateMessagesByConversationId() {
		return new Error("Must override!");
	}

	getMessagesByConversations() {
		return new Error("Must override!");	
	}

	createConversation() {
		return new Error("Must override!");
	}

	storePrivateMessage() {
		return new Error("Must override!");
	}

	getConversationId() {
		return new Error("Must override!");
	}

	updateMessageReadFlagByIds() {
		return new Error("Must override!");
	}

	searchByQuery() {
		return new Error("Must override!");
	}
}

module.exports = PrivateMessageDAO;