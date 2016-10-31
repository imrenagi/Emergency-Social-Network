var expect = require('expect.js');
var sinon = require('sinon');

var dateHelper = require('../../helpers/date');

var userDAOImpl = require('../../services/userDAOImpl');
var AnnouncementDAOImpl = require('../../services/announcementDAOImpl');
var PublicMessageDAOImpl = require('../../services/publicMessageDAOImpl');
var PrivateMessageDAOImpl = require('../../services/privateMessageDAOImpl');
var SearchServiceImpl = require('../../services/searchServiceImpl');

var announcementDAO = new AnnouncementDAOImpl();
var userDAO = new userDAOImpl();
var publicMessageDAO = new PublicMessageDAOImpl();
var privateMessageDAO = new PrivateMessageDAOImpl();
var searchService = new SearchServiceImpl(userDAO, announcementDAO, publicMessageDAO, privateMessageDAO);

var announcementDAOMock = sinon.mock(announcementDAO);
var userDAOMock = sinon.mock(userDAO);
var publicMessageDAOMock = sinon.mock(publicMessageDAO);
var privateMessageDAOMock = sinon.mock(privateMessageDAO);

suite('Search Service Implementation Test', function() {

	setup(function() {
		//todo setup fixture here
	})

	teardown(function() {
		//teardown function here
	})

	test('current page must be equal to 1 with page 0 and page 1', function(done) {
		expect(1).to.be.eql(searchService.currentPage(0))
		expect(1).to.be.eql(searchService.currentPage(1))
		done()
	});

	test('current page must be equal to the page if the page is greater than 1', function(done) {
		expect(2).to.be.eql(searchService.currentPage(2))
		expect(3).to.be.eql(searchService.currentPage(3))
		expect(4).to.be.eql(searchService.currentPage(4))
		done()
	})

	test('offset should be 0 when the page is 0 or 1', function(done) {
		expect(0).to.be.eql(searchService.offset(0, 1));
		expect(0).to.be.eql(searchService.offset(1, 1));
		done()
	})

	test('offset should be correct when page greater than 1', function(done) {
		expect(10).to.be.eql(searchService.offset(2, 10))
		expect(20).to.be.eql(searchService.offset(3, 10))
		expect(5).to.be.eql(searchService.offset(2, 5))
		done()
	})

	test('format announcement should return corect format', function(done) {

		var result = {
			id : 1,
			sender_id : 10,
			user_name : 'Jeff',
			message : 'This is the message',
			created_at : '2016-02-01 00:00:00',
			latitude : 100.0,
			longitude : 120.0
		}

		var expectedOutput = {
			id: 1,
			sender: {
				id: 10,
				user_name: 'Jeff'
			},
			text: result.message,
			timestamp: dateHelper.convertDateToTimestamp('2016-02-01 00:00:00'),
			location: {
				lat: 100.0,
				long: 120.0
			}
		};

		expect(expectedOutput).to.be.eql(searchService.formatAnnouncement(result));
		done()
	})

	test('format message should return correct format', function(done) {
		var result = {
			id : 1,
			sender_id : 10,
			user_name : 'Jeff',
			message : 'this is a message',
			created_at : '2016-02-01 00:00:00',
			message_status : 2,
			latitude : 100.0,
			longitude : 20.0
		}

		var message = {
			id: 1,
			sender: {
				id: 10,
				user_name: 'Jeff'
			},
			text: 'this is a message',
			timestamp: dateHelper.convertDateToTimestamp('2016-02-01 00:00:00'),
			status: 2,
			location: {
				lat: 100.0,
				long: 20.0
			}
		}

		expect(message).to.be.eql(searchService.formatMessage(result));
		done();
	})

	test('empty string to query filter should return empty arr', function(done) {
		var query = '';
		expect(0).to.be.eql(searchService.searchQueryFilter(query).length);
		done();
	})

	test('all word in query is using stopword, the query filter should be empty', function(done) {
		var query = 'about across after all';
		expect(0).to.be.eql(searchService.searchQueryFilter(query).length);
		done();
	})

	test('all word in query is using stopword incase sensitive, the query filter should be empty', function(done) {
		var query = 'about acRoss after All';
		expect(0).to.be.eql(searchService.searchQueryFilter(query).length);
		done();
	})

	test('all word used in query are only non-stopword', function(done) {
		var query = 'about Imre All nagi';
		expect(2).to.be.eql(searchService.searchQueryFilter(query).length);
		expect(['Imre','nagi']).to.be.eql(searchService.searchQueryFilter(query));
		done();
	})



})

