var expect = require('expect.js');
var sinon = require('sinon');

var db = require('../../services/db');
var AnnouncementDAO = require('../../services/announcementDAOImpl');

var announcementDAO;
var dbMock;

suite('Announcement Data Object Impl Test', function() {

	setup(function(done) {
		dbMock = sinon.mock(db);
		announcementDAO = new AnnouncementDAO(db);
		done();
	});

	test('Should be able to save the announcement',function(done) {
		var announcement = {
			senderId: 1,
			message: "this is a new announcement",
			lat: 100.0,
			long: 20.0
		};

		var queryCallBack = {
		  query: function(q, v, cb) {			  	
		  	cb(null, {insertId : 1});
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);
	
		announcementDAO.save(announcement).then(res => {
			expect(res).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

});