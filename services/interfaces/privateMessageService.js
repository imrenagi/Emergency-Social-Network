"use strict";

class PrivateMessageService {
	constructor(privateMessageDAO) {
	    this.privateMessageDAO = privateMessageDAO;

	    if(this.getAllConversations === undefined) {
	    	throw Error("Must override!");
	    }

	  	if(this.getAllPrivateMessages === undefined) {
	  		throw Error("Must override!");
	  	}
	}

}

module.exports = PrivateMessageService;