"use strict";

var SMTPServer = require('./interfaces/smtpServerInterface');

class GmailSmtpSenderImpl extends SMTPServer {

	constructor(transporter) {
		super();
		this.transporter = transporter;
	}
	
	sendEmail(target, subject, text, body){
		var that = this;
		var mailOptions = {
		    from: '"SA2-ESN Administrator" <sa2.esn@gmail.com>',
		    to: target, 
		    subject: subject, 
		    text: text,
		    html: body
		};
		
		return that.transporter.sendMail(mailOptions)
	}
}

module.exports = GmailSmtpSenderImpl;
