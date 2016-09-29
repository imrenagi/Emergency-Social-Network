"use strict";

class directoryService {

	constructor() {
		if(this.getDirectory === undefined) {
			throw("Must override!");
		}
	}
}

module.exports = directoryService;
