var AnnouncementServiceImpl = require('../services/announcementServiceImpl');
var AnnouncementDAOImpl = require('../services/announcementDAOImpl');

// var NotificationServiceImpl = require('../services/notificationServiceImpl');
// var UserDataObject = require('../services/userDataObjectImpl');
// var db = require('../services/db');
// var GmailSmtpSenderImpl = require('../services/gmailSmtpSenderImpl');
// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport('smtps://sa2.esn@gmail.com:imrenagi@smtp.gmail.com');
// var userDataObject = new UserDataObject(db);
// var mailSender = new GmailSmtpSenderImpl(transporter);
// var notificationService = new NotificationServiceImpl(userDataObject, mailSender);

var announcementDAO = new AnnouncementDAOImpl();
var announcementService = new AnnouncementServiceImpl(announcementDAO);

exports.retrieveAnnouncements = function(req, res, next) {
	var lastId = req.param('last_id') || -1;
  	var limit = req.param('limit') || 30;
  
  	announcementService.getAllAnnouncements(lastId, limit)
	  	.then(function(results) {
	      	res.send(JSON.stringify(results));
	    }).catch(function(err) {
	      res.send(err);
	    })
}
