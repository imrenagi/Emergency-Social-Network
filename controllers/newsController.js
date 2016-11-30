var NewServiceImpl = require('../services/newsServiceImpl');
var NewsDAOImpl = require('../services/newsDAOImpl');
var db = require('../services/db');

var newDAO = new NewsDAOImpl(db);
var newService = new NewServiceImpl(newDAO);

var isValid = function(body) {
	if (body.reporter_id === undefined || body.reporter_id === null) return false;
	if (body.title === undefined || body.title === null) return false;
	if (body.message === undefined || body.message === null) return false;
	return true;
}

exports.getAllNews = function(req, res, next) {
	newService.getAllNews().then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err) {
		res.send(err);
	});
}

exports.getNewsById = function(req, res, next) {
	var id = req.param('id');

	newService.getNewsById(id).then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err) {
		res.send(err);
	});
}

exports.createNews = function(req, res, next) {
	if (!isValid(req.body)) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = "Bad request body"
	  	next(err);
	}
	newService.createNews(req.body).then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err) {
		res.send(err);
	});
}