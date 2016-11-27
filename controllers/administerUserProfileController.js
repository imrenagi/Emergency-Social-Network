var directoryServiceImpl = require('../services/directoryServiceImpl');
var directoryService = new directoryServiceImpl();

var encryptor = require('../helpers/passwordEncryptor');
const RESERVED_USERNAMES = require('../utils/reservedUsernames');

var isValidRequest = function(userName, isActive, privilage, password) {
	if (userName === null || userName === undefined) {
		return false;
	}

	if (userName.length < 3) {
		return false;
	}
	for (var i in RESERVED_USERNAMES) {
  		if(userName.toLowerCase() === RESERVED_USERNAMES[i]) {
			return false;
		}
	}

	if (isActive != '0' && isActive != '1') {
		return false;
	}

	if (privilage != '0' && privilage != '1') {
		return false;
	}

	if (password === null || password === undefined) {
		return false;
	}

	if (password.length < 4) {
		return false;
	}
	
	return true;
}

exports.getUsers = function(req, res, next) {
	var page = req.param('page') || 1;
  	var limit = req.param('limit') || 10;
  
  	directoryService.getUsers(page, limit)
	  	.then(function(results) {
	      res.send(JSON.stringify(results));
	    }).catch(function(err) {
	      res.send(err);
	    })
}

exports.updateUser = function(req, res, next) {
	var id = req.param('id');
	var userName = req.body.user_name;
	var isActive = req.body.is_active;
	var privilage = req.body.privilage;
	var password = req.body.password;
	var encryptedPassword = encryptor.createHash(password);



	if (!isValidRequest(userName, isActive, privilage, password)) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = "Bad request body"
	  	console.log(err);
	  	next(err);
	}

	var values = [userName, isActive, privilage, encryptedPassword];
	

	directoryService.updateUser(id, values).then(function(ressult) {
		res.send(ressult);
	}).catch(function(err) {
		res.send(err);
	});
}