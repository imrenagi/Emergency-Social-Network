"use strict";

class User {
	constructor(id, user_name) {
		this.id = id
		this.user_name = user_name
	}

	getId() {
		return this.id;
	}

	getUserName() {
		return this.user_name
	}

}

module.exports = User;