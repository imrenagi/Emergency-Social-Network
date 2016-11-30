"use strict";

var user = require('./userDataObjectImpl');

class NotificationServiceImpl {
	constructor(userDataObject, sender) {
		this.userDAO = userDataObject;
		this.sender = sender;
	}

	sendAnnouncementEmail(senderName, message) {
		var that = this;	
		let subject = "Announcement from "+ senderName +" in Emergency Social Network";	
		let html = "Dear Citizen, <br> <br> " + message + 
		" <br><br> <a href=\"http://localhost:3000\">Check the latest update in Emergency Social Network here!</a> ";

		return this.userDAO.getAllEmails().then(res => {
			return that.sender.sendEmail(that.joinEmails(res),
				subject,
				message,
				html)
		});
	}

	joinEmails(emails) {
		return emails.join(",");	
	}
}

module.exports = NotificationServiceImpl;