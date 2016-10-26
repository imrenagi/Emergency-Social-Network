"use strict";

class userDAO {
	constructor() {
		if(this.updateOnline === undefined) {
			throw Error("Must override!");
		}

		if(this.updateStatus === undefined) {
			throw Error("Must override!");
		}

		if(this.searchByUserName === undefined) {
			throw Error("Must override!");	
		}

	}
}

module.exports = userDAO;