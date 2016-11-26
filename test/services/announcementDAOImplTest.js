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
			sender_id: 1,
			message: "this is a new announcement",
			lat: 100.0,
			long: 20.0
		};

		var queryCallBack = {
		  query: function(q, v, cb) {	
		  	expect(q).to.be.eql("INSERT INTO announcements (sender_id, message, latitude, longitude) values (?,?,?,?)");
		  	expect(v).to.be.eql([announcement.sender_id, announcement.message, announcement.lat, announcement.long]);
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

	test('Saving announcement returns error',function(done) {
		var announcement = {
			sender_id: 1,
			message: "this is a new announcement",
			lat: 100.0,
			long: 20.0
		};

		var queryCallBack = {
		  query: function(q, v, cb) {			  	
		  	cb({ status : "failed" } , null);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);
	
		announcementDAO.save(announcement).then(res => {
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {	
			expect(err.status).to.be.eql("failed");
			dbMock.verify();
			dbMock.restore();
			done();
		});
	});

	test('Saving announcement without latitude and longitude should be okay', function(done) {
		var announcement = {
			sender_id: 1,
			message: "this is a new announcement"
		};

		var queryCallBack = {
		  query: function(q, v, cb) {	
		  	expect(q).to.be.eql("INSERT INTO announcements (sender_id, message) values (?,?)");
		  	expect(v).to.be.eql([announcement.sender_id, announcement.message]);
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

	test('Get announcement by id should return correct data element', function(done) {
		var announcementId = 1;

		var queryCallBack = {
		  query: function(q, v, cb) {	
		  	expect(v).to.be.eql(1);
		  	cb(null, [1,2,3,4]);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);

		announcementDAO.getByAnnouncementId(1).then(res => {
			expect(res).to.be.eql(1);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.restore();
			done(err);
		})
	});

	test('Get announcement by id should return error callback', function(done) {
		var announcementId = 1;

		var queryCallBack = {
		  query: function(q, v, cb) {	
		  	expect(v).to.be.eql(1);
		  	cb("error", null);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);

		announcementDAO.getByAnnouncementId(1).then(res => {			
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			expect(err).to.be.eql("error");
			dbMock.restore();
			done();
		})
	});

	test('Get announcement in page 1 should fetch with correct query', function(done) {
		var limit = 20;
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("SELECT a.*, u.user_name from announcements a left join users u on u.id = a.sender_id order by a.id desc limit 20");
		  	cb(null, []);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);

		announcementDAO.findAll(-1, limit).then(res => {
			expect(res.length).to.be.eql(0);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.restore();
			done(err);	
		})

	})

	test('Get announcement with last id should fetch with correct query', function(done) {
		var limit = 20;
		var lastId = 10;
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("SELECT a.*, u.user_name from announcements a left join users u on u.id = a.sender_id where a.id >=-10 and a.id < 10 order by a.id desc");
		  	cb(null, []);
		  }
		}

		dbMock.expects('get').once().returns(queryCallBack);

		announcementDAO.findAll(lastId, limit).then(res => {
			expect(res.length).to.be.eql(0);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.restore();
			done(err);	
		})

	})

	test('Search announcement should return correct length and total', function(done) {

		var queryPaginationCB = {
		  query: function(q, cb) {			  	
		  	cb(null, [{total: 10}, {total: 10}, {total: 10}, {total: 10}, {total: 10}]);
		  }
		}

		dbMock.expects('get').twice().returns(queryPaginationCB);

		announcementDAO.searchByQuery(["test"], 0, 10).then(res => {
			expect(res.total <= 10).to.be.ok();
			expect(res.data.length).to.be.eql(5);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.restore();
			done(err);	
		})
	})

	test('Search announcement with multiple keywrods sould return correct length and total', function(done) {

		var queryPaginationCB = {
		  query: function(q, cb) {			  	
		  	cb(null, [{total: 10}, {total: 10}, {total: 10}, {total: 10}, {total: 10}]);
		  }
		}

		dbMock.expects('get').twice().returns(queryPaginationCB);

		announcementDAO.searchByQuery(["test", "test2"], 0, 10).then(res => {
			expect(res.total <= 10).to.be.ok();
			expect(res.data.length).to.be.eql(5);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {
			dbMock.restore();
			done(err);	
		})
	})

});