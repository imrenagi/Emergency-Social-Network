"use strict";

class User {
	constructor(id, user_name, online, status) {
		this.id = id
		this.user_name = user_name
		this.online = online || 0
		this.status = status || 0
		this.location = null
		this.status_updated_at = null;
	}

	getId() {
		return this.id;
	}

	getUserName() {
		return this.user_name
	}

}

module.exports = User;