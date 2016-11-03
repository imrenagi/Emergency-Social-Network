var expect = require('expect.js');
var sinon = require('sinon');

var AnnouncementDAOImpl = require('../../services/announcementDAOImpl');
var AnnouncementServiceImpl = require('../../services/announcementServiceImpl');
var AnnouncementDAOInterface = require('../../services/interfaces/announcementDAO');
var AnnouncementServiceInterface = require('../../services/interfaces/announcementService');

var announcementDAO = new AnnouncementDAOImpl();
var announcementService = new AnnouncementServiceImpl(announcementDAO);
var announcementDAOMock = sinon.mock(announcementDAO);

suite('Announcement Service Implementation Test', function() {

	setup(function() {
		//todo setup fixture here
	})

	teardown(function() {
		//teardown function here
	})

	test('Interface should throw Error', function() {
		var x = new AnnouncementDAOInterface();
		expect(x.save()).to.be.eql(new Error('Must override!'));
		expect(x.getByAnnouncementId()).to.be.eql(new Error('Must override!'));
		expect(x.findAll()).to.be.eql(new Error('Must override!'));
		expect(x.searchByQuery()).to.be.eql(new Error('Must override!'));

		var service = new AnnouncementServiceInterface();
		expect(service.post()).to.be.eql(new Error('Must override!'));
		expect(service.getAllAnnouncements()).to.be.eql(new Error('Must override!'));
		expect(service.getByAnnouncementId()).to.be.eql(new Error('Must override!'));
	})

	test('posting an anouncement should call save in DAO', function() {
		var senderId = 1
		var message = 'this is a message'
		var lat = 150.0
		var long = 100.0

		var arg = {
			sender_id: senderId,
			message: message,
			lat: lat,
			long: long
		}; 

		announcementDAOMock.expects('save').once().withExactArgs(arg).returns(
			Promise.resolve({})
		);

		announcementService.post(senderId, message, lat, long);
		announcementDAOMock.verify()
		announcementDAOMock.restore()
	})

	test('retrieving announcement by id should call getByAnnouncementId', function(){
		announcementDAOMock.expects('getByAnnouncementId').once().withExactArgs(1).returns(
			Promise.resolve({})
		);
		announcementService.getByAnnouncementId(1);
		announcementDAOMock.verify();
		announcementDAOMock.restore();
	})

	test('retrieving all announcement should call findAll', function() {
		var lastId = 10;
		var limit = 10;
		announcementDAOMock.expects('findAll').once().withExactArgs(10,10).returns(
			Promise.resolve({})
		);
		announcementService.getAllAnnouncements(10,10);
		announcementDAOMock.verify();
		announcementDAOMock.restore();
	})

 
})
