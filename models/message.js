"use strict";

class Message {
	constructor(id, sender_name, timestamp, status, location) {
		this.id = id
		this.sender_name = sender_name;
		this.timestamp = timestamp;
		this.status = status;
		this.location = location;
	}
}

module.exports = Message;