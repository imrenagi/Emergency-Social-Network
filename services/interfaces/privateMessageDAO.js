"use strict";

class PrivateMessageDAO {
	constructor() {
		if(this.getAllConversatonsByUserId === undefined) {
			throw Error('Must override!');
		}
		if(this.getPrivateMessagesByConversationId === undefined) {
			throw new Error('Must override!');
		}
	}
}

module.exports = PrivateMessageDAO;