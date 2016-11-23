var directoryServiceImpl = require('../services/directoryServiceImpl');
var directoryService = new directoryServiceImpl();

var encryptor = require('../helpers/passwordEncryptor');

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

	var values = [userName, isActive, privilage, encryptedPassword];

	//TODO
	if (0) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = "Bad request body"
	  	console.log(err);
	  	next(err);
	}

	directoryService.updateUser(id, values).then(function(ressult) {
		res.send(ressult);
	}).catch(function(err) {
		res.send(err);
	});
}