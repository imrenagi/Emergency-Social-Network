"use strict";

class PublicMessageDAO {
	constructor() {
		if(this.searchByQuery === undefined) {
			throw Error("Must override!");
		}
		
	}
}

module.exports = PublicMessageDAO;