"use strict";

class SearchService {
	constructor(userDAO) {
		
		this.userDAO = userDAO

	    if (this.userByName === undefined) {
	    	throw Error("Must override!");	
	    }

	    if (this.userByStatus === undefined) {
	    	throw Error("Must override!");	
	    }
	}
}

module.exports = SearchService;