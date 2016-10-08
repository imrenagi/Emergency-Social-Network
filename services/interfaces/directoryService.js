"use strict";

class directoryService {

	constructor() {
		if(this.getDirectory === undefined) {
			throw("Must override!");
		}

		if(this.getUser === undefined) {
			throw("Must override!");
		}

		if(this.updateUserStatus === undefined) {
			throw("Must override!");
		}
	}
}

module.exports = directoryService;
