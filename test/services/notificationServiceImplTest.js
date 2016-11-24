var expect = require('expect.js');
var sinon = require('sinon');

var NotificationServiceImpl = require('../../services/notificationServiceImpl');
var UserDataObject = require('../../services/userDataObjectImpl');
var GmailSmtpSenderImpl = require('../../services/gmailSmtpSenderImpl');

var userDataObject = new UserDataObject();
var mailSender = new GmailSmtpSenderImpl();

var userMock = sinon.mock(userDataObject);
var mailSenderMock = sinon.mock(mailSender);

var notificationService = new NotificationServiceImpl(userDataObject, mailSender);

suite('Search Service Implementation Test', function() {

	setup(function() {
		//todo setup fixture here
	})

	teardown(function() {
		//teardown function here
	})

	test('Join array of two string should be correct', function() {
		var array = ["imre.nagi@gmail.com", "nagi.imre@gmail.com"]
		expect(notificationService.joinEmails(array)).to.be.eql("imre.nagi@gmail.com,nagi.imre@gmail.com");
	})

	test('Join array of one string should be correct', function() {
		var array = ["imre.nagi@gmail.com"]
		expect(notificationService.joinEmails(array)).to.be.eql("imre.nagi@gmail.com");
	})

	test('Join empty array should return empty string', function() {
		var array = []
		expect(notificationService.joinEmails(array)).to.be.eql("");
	})

	test('Send announcement email failed to get users email', function(done) {
		var userMock = sinon.mock(userDataObject);
		userMock.expects('getAllEmails').once().returns(Promise.reject("This is dummy error"));

		notificationService.sendAnnouncementEmail("Jhon", "This is the message").catch(err => {
			expect(err).to.eql("This is dummy error");
			userMock.verify();
			userMock.restore();
			done();
		})
	})

	test('Send announcement email should sent to correct email', function(done) {
		var userMock = sinon.mock(userDataObject);
		var mailSenderMock = sinon.mock(mailSender);

		userMock.expects('getAllEmails').once().returns(Promise.resolve(["imre@gmail.com","nagi@gmail.com"]));
		mailSenderMock.expects('sendEmail').once().returns(
			Promise.resolve({
				accepted: [
					"imre@gmail.com",
					"nagi@gmail.com"
				],
				rejected: []
			}))

		notificationService.sendAnnouncementEmail("Dinar", "Please come and see!").then(res => {
			expect(res.accepted.length).to.eql(2);
			expect(res.rejected.length).to.eql(0);
			expect(res.accepted[0]).to.be.eql("imre@gmail.com");
			expect(res.accepted[1]).to.be.eql("nagi@gmail.com");
			userMock.verify();
			mailSenderMock.verify()
			userMock.restore();
			mailSenderMock.restore();
			done();
		}).catch(err => {
			userMock.restore();
			mailSenderMock.restore();			
			done(err);
		})
	})

	test('Send announcement should sent correct email content', function(done) {
		var userMock = sinon.mock(userDataObject);
		var mailSenderMock = sinon.mock(mailSender);

		var senderName = "Dinar";
		var message = "Please come and see!";

		var subject = "Announcement from "+ senderName +" in Emergency Social Network"
		var html = "Dear Citizen, <br> <br> " + message + " <br><br> <a href=\"http://localhost:3000\">Check the latest update in Emergency Social Network here!</a> ";
		
		userMock.expects('getAllEmails').once().returns(Promise.resolve(["imre@gmail.com","nagi@gmail.com"]));
		mailSenderMock.expects('sendEmail').once().withExactArgs("imre@gmail.com,nagi@gmail.com", subject, message, html).returns(Promise.resolve())

		notificationService.sendAnnouncementEmail(senderName, message).then(res => {
			userMock.verify();
			mailSenderMock.verify()
			userMock.restore();
			mailSenderMock.restore();
			done();
		}).catch(err => {
			userMock.restore();
			mailSenderMock.restore();			
			done(err);
		})
	})
})