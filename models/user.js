"use strict";

class User {
	constructor(id, user_name, online, status, privilage) {
		this.id = id
		this.user_name = user_name
		this.online = online || 0
		this.status = status || 0
		this.location = undefined
		this.status_updated_at = undefined;
		this.privilage = privilage || 0;
	}

	getId() {
		return this.id;
	}

	getUserName() {
		return this.user_name
	}

}

module.exports = User;