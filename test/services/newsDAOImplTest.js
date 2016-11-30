var expect = require('expect.js');
var sinon = require('sinon');

var db = require('../../services/db');
var NewsDAOImpl = require('../../services/newsDAOImpl');

var newsDAO;
var dbMock;

suite('NewsDAO Impl Test', function() {

	setup(function(done) {
		dbMock = sinon.mock(db);
		newsDAO = new NewsDAOImpl(db);
		done();
	});

	test('GetAllNews can return all news', function(done) {
		var expectedResult = {
			id: '1',
			sender_id: '1',
			user_name: 'Sam',
			title: 'this is a title',
			content: 'this is the content',
			created_at: '2016-11-29 12:51:25',
			picture: 'picture url',
			latitude: '100',
			longitude: '100',
			status: '1'
		}
		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql("SELECT n.*, u.user_name FROM news n left join users u on u.id = n.sender_id");		  	
		  	cb(null, expectedResult);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);

		newsDAO.getAll().then(res => {
			expect(res).to.be.eql(expectedResult);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('GetNewsById can return corresponding news', function(done) {
		var expectedResult = {
			id: '1',
			sender_id: '1',
			user_name: 'Sam',
			title: 'this is a title',
			content: 'this is the content',
			created_at: '2016-11-29 12:51:25',
			picture: 'picture url',
			latitude: '100',
			longitude: '100',
			status: '1'
		}

		var queryCallBack = {
		  query: function(q, cb) {	
		  	expect(q).to.be.eql('SELECT n.*, u.user_name FROM news n left join users u on u.id = n.sender_id WHERE n.id = 1');		  	
		  	cb(null, expectedResult);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		newsDAO.getById(1).then(res => {
			expect(res).to.be.eql(expectedResult);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});

	test('Save news can return 200', function(done) {
		var values = [1, 'this is a title', 'this is the content', 100, 100, 1, 'url'];
		var expectedResult = {code: 200}
		var queryCallBack = {
		  query: function(q, values, cb) {	
		  	expect(q).to.be.eql('INSERT INTO news (sender_id, title, content, latitude, longitude, status, picture) values (?, ?, ?, ?, ?, ?, ?)');		  	
		  	cb(null, expectedResult);
		  }
		}
		dbMock.expects('get').once().returns(queryCallBack);
	
		newsDAO.save([1, 'this is a title', 'this is the content', 100, 100, 1, 'url']).then(res => {
			expect(res).to.be.eql(expectedResult);
			dbMock.verify();
			dbMock.restore();
			done();
		}).catch(err => {			
			dbMock.restore();
			done(err);
		});
	});




})