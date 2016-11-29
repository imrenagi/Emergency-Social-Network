var directoryServiceImpl = require('../services/directoryServiceImpl');
var directoryService = new directoryServiceImpl();
var userValidator = require('../utils/userValidator');

var encryptor = require('../helpers/passwordEncryptor');
const RESERVED_USERNAMES = require('../utils/reservedUsernames');

const ADMIN_ERROR = {
        INVALID_FIELD: 'UpdateError.InvalidUserInfor',
		PASS_UNDER_QUALITY: 'UpdateError.PasswordIsUnderMinimumQuality'
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
	var password = req.body.password || '';
	
	if (!userValidator.isUserNameValid(userName) ||
		!userValidator.isValidPrivilage(privilage) ||
		!userValidator.isValidActiveStatus(isActive)) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = ADMIN_ERROR.INVALID_FIELD
	  	next(err);
	}

	if (password === '') {
		var values = [userName, isActive, privilage];
		directoryService.updateUserWithoutPassword(id, values).then(function(ressult) {
			res.send(ressult);
		}).catch(function(err) {
			res.send(err);
		});
	} else {
		if(userValidator.isPasswordValid(password)) {
			var encryptedPassword = encryptor.createHash(password);
			var values = [userName, isActive, privilage, encryptedPassword];
			directoryService.updateUser(id, values).then(function(ressult) {
				res.send(ressult);
			}).catch(function(err) {
				res.send(err);
			});
		} else {
			var err = new Error();
		  	err.status = 400;
		  	err.message = ADMIN_ERROR.PASS_UNDER_QUALITY
		  	next(err);
		}
	}	
}