var expect = require('expect.js');
var sinon = require('sinon');

var NewsServiceImpl = require('../../services/newsServiceImpl');
var NewsDAOImpl = require('../../services/newsDAOImpl');
var CloudImageServiceImpl = require('../../services/cloudImageServiceImpl');


var db = require('../../services/db');

var cloudImageService = new CloudImageServiceImpl();
var newsDAO = new NewsDAOImpl(db);
var newsService = new NewsServiceImpl(newsDAO, cloudImageService);
var newsDAOMock = sinon.mock(newsDAO);
var cloudImageServiceMock = sinon.mock(cloudImageService);

suite('News Service Implementation Test', function() {

	setup(function() {
		//todo setup fixture here
	})

	teardown(function() {
		//teardown function here
	})

	test('formatNews returns correctly', function() {
		var result = {
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

		var news = {
			id: '1',
			reporter: {
				id: '1',
				user_name: 'Sam'
			},
			timestamp: '1480452685',
			status: '1',
			location: {
				lat: '100',
				long: '100',
			},
			title: 'this is a title',
			message: 'this is the content',
			image_url: 'picture url'
		}
		expect(newsService.formatNews(result)).to.be.eql(news);
	});

	test('getAllNews should call getAll', function() {
		newsDAOMock.expects('getAll').once().withExactArgs().returns(Promise.resolve({}));
		newsService.getAllNews();
		newsDAOMock.verify();
		newsDAOMock.restore();
	})

	test('getNewsById should call getById', function() {
		newsDAOMock.expects('getById').once().withExactArgs(1).returns(Promise.resolve({}));
		newsService.getNewsById(1);
		newsDAOMock.verify();
		newsDAOMock.restore();
	})

	test('Create news works correctly without image', function() {
		var news = {
    			"reporter_id" : 2,
                "status" : 1,
                "lat" : 100.0,
                "long" : 100.0,
                "title" : "this is a title",
                "message" : "http://www.w3schools.com/css/img_fjords.jpg=",
                "image_binary" : null
		}
		var values = [2, 'this is a title', 'http://www.w3schools.com/css/img_fjords.jpg=', 100.0, 100.0, 1, null];
		newsDAOMock.expects('save').once().withExactArgs(values).returns(Promise.resolve({}));
		newsService.createNews(news);
		newsDAOMock.verify();
		newsDAOMock.restore();
	})

	test('Create news works correctly with image', function() {
		var news = {
    			"reporter_id" : 2,
                "status" : 1,
                "lat" : 100.0,
                "long" : 100.0,
                "title" : "this is a title",
                "message" : "http://www.w3schools.com/css/img_fjords.jpg=",
                "image_binary" : '12345'
		}
		var values = [2, "this is a title", "http://www.w3schools.com/css/img_fjords.jpg=", 100, 100, 1, null]
		cloudImageServiceMock.expects('cloudinaryConfig').once();
		cloudImageServiceMock.expects('uploadImage').once().withExactArgs(news.image_binary).returns(Promise.resolve('url'));
		newsService.createNews(news);
		newsDAOMock.verify();
		cloudImageServiceMock.verify();
		newsDAOMock.restore();
		cloudImageServiceMock.restore();
	})



})
