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

	    if(this.isUserNameValid === undefined) {
	    	throw Error("Must override!");
	    }

	    if(this.isPasswordValid === undefined) {
	    	throw Error("Must overirde");
	    }
  	}


}

module.exports = JoinService;
