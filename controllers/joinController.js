var JoinServiceImpl = require('../services/joinServiceImpl');
var emailValidator = new require('../utils/emailValidator');
var userValidator = new require('../utils/userValidator');
var userDAOImpl = require('../services/userDAOImpl');
var db = require('../services/db');

var userDAO = new userDAOImpl(db);
var joinService = new JoinServiceImpl(userDAO);

const JOIN_ERROR = {
        INCORRECT_PASSWORD: 'JoinError.IncorrectPassword',
        USER_NAME_UNDER_QUALITY: 'JoinError.UserNameIsUnderMinimumQuality',
		PASS_UNDER_QUALITY: 'JoinError.PasswordIsUnderMinimumQuality',
		EMAIL_INVALID: 'JoinError.InvalidEmail',
		UNKNOWN_ERROR: 'JoinError.UnknownError'
    }

exports.joinPage = function(req, res, next) {
	res.send("This is the join page");
	//TODO: return the joinCommunity page to client
};

exports.joinCommunity = function(req, res, next) {
	var userName = req.body.user_name;
	var password = req.body.password;
	if(!userValidator.isUserNameValid(userName)) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = JOIN_ERROR.USER_NAME_UNDER_QUALITY;
	  	next(err);
	}
	else if(!userValidator.isPasswordValid(password)) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = JOIN_ERROR.PASS_UNDER_QUALITY;
	  	next(err);
	}
	else {
		joinService.join(userName, password)
		.then(res => {
			return joinService.validateUser(res);	
		})
		.then(function(result){
			switch(result.code) {
		    	case 200:
		    		req.session.user = {
		    			id: result.body.id,
		    			user_name: result.body.user_name,
		    			privilage: result.body.privilage
		    		}
		        	res.status(200).send(JSON.stringify(result.body));
		        	break;
		    	case 204:
		        	res.status(204).send(JSON.stringify({}));
		        	break;
		    	case 400:
		    		var err = new Error();
	  				err.status = 400;
	  				err.message = JOIN_ERROR.INCORRECT_PASSWORD;
	  				next(err)
		        	break;
		    	default:
					var err = new Error();
	  				err.status = 400;
	  				err.message = JOIN_ERROR.INCORRECT_PASSWORD;
	  				next(err);
		    		break;
			}
		}).catch(function(err) {	
			res.send(err);
		})
	}	
};

exports.confirm = function(req, res, next) {
	var userName = req.body.user_name;
	var password = req.body.password;
	var email = req.body.email || '';
	
	if(email.length > 0 && !emailValidator.isValid(email)) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = JOIN_ERROR.EMAIL_INVALID;
	  	next(err);
	} else if (email.length == 0 || emailValidator.isValid(email)) {
		joinService.confirm(userName, password, email)
		.then(function(result) {
			req.session.user = {
		    	id: result.id,
		    	user_name: result.user_name,
		    	privilage: result.privilage
			}
			res.send(JSON.stringify(result));
		}).catch(function(err) {
			res.send(err);
		})
	}

}