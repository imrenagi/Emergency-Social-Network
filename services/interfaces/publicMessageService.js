"use strict";

class PublicMessageService {
		constructor() {
	    if (this.getAllMessages === undefined) {
	    	throw Error("Must override!");	
	    }
}

module.exports = PublicMessageService;