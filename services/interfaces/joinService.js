"use strict";

class JoinService {

	constructor() {
	    if (this.join === undefined) {
	    	//This interface should return a promise!
	    	throw Error("Must override!");	
	    }

	    if (this.confirm === undefined) {
	    	//This interface should return a promise!
	    	throw Error("Must override!");	
	    }
  	}

}

module.exports = JoinService;
