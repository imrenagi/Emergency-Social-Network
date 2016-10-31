var expect = require('expect.js');
var sinon = require('sinon');

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

	test('testing a class', function(done) {
		done()
	});
 
})
