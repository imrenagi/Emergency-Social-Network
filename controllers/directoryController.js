
var directoryServiceImpl = require('../services/directoryServiceImpl');
var directoryService = new directoryServiceImpl();


exports.displayDirectory = function(req, res, next) {
	var page = req.param('page') || 1;
	var limit = req.param('limit') || 100;
	directoryService.getDirectory(page, limit).then(function(result) {
		res.send(JSON.stringify(result));
	})
}

exports.getUser = function(req, res, next) {
	var userId = req.params.id;
	if (userId === undefined) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = "Invalid request!";
	  	next(err);
	} else {
		directoryService.getUser(userId).then(function(result) {
			res.status(200).send(JSON.stringify(result))
		}).catch(function(err) {
			next(err)
		}) 
	}
}

exports.updateStatus = function(req, res, next) {
	var userId = req.params.id;
	var status = req.param('status');
	var lat = req.param('lat');
	var long = req.param('long')
	if (userId === undefined || status === undefined) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = "Invalid request!";
	  	next(err);
	} else {
		// var user = directoryService.updateUserStatus(userId);
		// res.send(user);

		directoryService.updateUserStatus(userId, status, lat, long).then(function(result) {
				res.send(result);
			}).catch(function(err) {
				next(err);
			})
	}
}

var emailValidator = new require('../utils/emailValidator');

const ERROR = {
		EMAIL_INVALID: 'JoinError.InvalidEmail'
    }

exports.updateEmail = function(req, res, next) {
	var email = req.body.email;
	if (!emailValidator.isValid(email) || email === undefined) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = ERROR.EMAIL_INVALID;
	  	next(err);
	} else {
		var userId = req.session.user.id;
		directoryService.updateEmail(userId, email).then(result => {
			res.send({});
		}).catch(err => {
			console.log(err);
			var err = new Error();
		  	err.status = 500;
		  	err.message = "Oops! Something wrong!";
		  	next(err);
		});	
	}
}

exports.getUserEmail = function(req, res, next) {
	var userId = req.session.user.id;
	directoryService.getEmail(userId).then(result => {
		res.send(result);
	}).catch(err => {
		next(err);
	});
}
