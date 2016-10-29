"use strict";

class PrivateMessageDAO {
	constructor() {
		if(this.getAllConversatonsByUserId === undefined) {
			throw Error('Must override!');
		}

		if(this.getPrivateMessagesByConversationId === undefined) {
			throw new Error('Must override!');
		}

		if(this.getMessagesByConversations === undefined) {
			throw new Error('Must override!');
		}

		if(this.createConversation === undefined) {
			throw new Error('Must override!');
		}

		if(this.storePrivateMessage === undefined) {
			throw new Error('Must override!');
		}

		if(this.getConversationId === undefined) {
			throw new Error('Must override!');
		}

		if(this.updateMessageReadFlagByIds === undefined) {
			throw new Error('Must override!');
		}

		if(this.searchByQuery === undefined) {
			throw new Error('Must override!');
		}

	}
}

module.exports = PrivateMessageDAO;