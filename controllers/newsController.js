var NewServiceImpl = require('../services/newServiceImpl');
var NewsDAOImpl = require('../services/newsDAOImpl');
var db = require('../services/db');

var newDAO = new NewsDAOImpl(db);
var newService = new NewServiceImpl(newDAO);

exports.getAllNews = function(req, res, next) {
	newService.getAllNews().then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err) {
		res.send(err);
	});
}

exports.createNews = function(req, res, next) {

	
	newService.createNews().then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err) {
		res.send(err);
	});
}

