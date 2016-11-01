"use strict";

class PrivateMessageService {
	constructor(privateMessageDAO) {
	    this.privateMessageDAO = privateMessageDAO;
	}

	getAllConversations() {
	    return new Error("Must override!");
	}

	getAllPrivateMessages(){
	  	return new Error("Must override!");
	}

	storePrivateMessage() {
	  	return new Error("Must override!");
	}

	createConversation(){
	  	return new Error("Must override!");
	}
	 
	getConversationId() {
	  	return new Error("Must override!");
	}

	updateMessageReadFlag() {
	 	return new Error("Must override!");
	}

}

module.exports = PrivateMessageService;