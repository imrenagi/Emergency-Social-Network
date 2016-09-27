"use strict";

class User {
	constructor(id, userName) {
		this.id = id
		this.userName = userName

		getId = function() {
			return this.id
		}

		getUserName = function() {
			return this.userName
		}
	}
}

export.modules = User;