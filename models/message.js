"use strict";

class Message {
	constructor(id, sender, text, timestamp, status, location) {
		this.id = id
		this.sender = sender;
		this.text = text;
		this.timestamp = timestamp;
		this.status = status;
		this.location = location;
	}
}

module.exports = Message;