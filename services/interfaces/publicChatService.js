'use strict';

class publicChatService {
	constructor() {
		if(this.getPreviousMessages === undefined) {
			throw Error("Must override!");
		}
	}
}

module.exports = publicChatService;