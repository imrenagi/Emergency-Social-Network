var expect = require('expect.js');
var sinon = require('sinon');

var GmailSmtpSenderImpl = require('../../services/gmailSmtpSenderImpl');

var nodemailer = require('nodemailer');
var nm, transport, mailSender;

suite('Gmail SMTP Sender Implementation Test', function() {

	setup(function(){
		transport = {
            name: 'testsend',
            version: '1',
            send: function (data, callback) {
                callback();
            },
            logger: false
        };
        nm = nodemailer.createTransport(transport);
        mailSender = new GmailSmtpSenderImpl(nm);
	})

	test('MailSender should send the message once', function(done) {
		sinon.stub(transport, 'send').yields(null, "something");
		mailSender.sendEmail("a@example.com", "Subject", "Message", "Message").then(res => {
            expect(transport.send.callCount).to.equal(1);
            expect(res).to.equal('something');
			transport.send.restore();
			done();
		}).catch(err => {
			transport.send.restore();
			done(err);
		});
	});

	test('MailSender should return any error message', function(done) {
		sinon.stub(transport, 'send').yields("error message");
		mailSender.sendEmail("a@example.com", "Subject", "Message", "Message").catch(function(err) {
			expect(transport.send.callCount).to.equal(1);
			expect(err).to.equal('error message');
			transport.send.restore();
			done();
		});
	});

	test('MailSender should sent correct parameter', function(done) {
		sinon.stub(transport, 'send', function(mail, callback) {
			expect(mail.data.from).to.equal('"SA2-ESN Administrator" <sa2.esn@gmail.com>');
			expect(mail.data.subject).to.equal("This is an important subject");
			expect(mail.data.text).to.equal("Message");
			expect(mail.data.html).to.equal("Message");
			callback();
		});

		mailSender.sendEmail("a@example.com", "This is an important subject", "Message", "Message").then(res => {
			transport.send.restore();
			done();
		});
	});
})