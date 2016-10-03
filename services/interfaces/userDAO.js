"use strict";

class userDAO {
	constructor() {
		if(this.updateOnline === undefined) {
			throw Error("Must override!");
		}
	}
}

module.exports = userDAO;