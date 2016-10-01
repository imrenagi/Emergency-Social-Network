var JoinServiceImpl = require('../services/joinServiceImpl');
var joinService = new JoinServiceImpl();

const JOIN_ERROR = {
        INCORRECT_PASSWORD: 'JoinError.IncorrectPassword',
        USER_NAME_UNDER_QUALITY: 'JoinError.UserNameIsUnderMinimumQuality',
		PASS_UNDER_QUALITY: 'JoinError.PasswordIsUnderMinimumQuality',
		UNKNOWN_ERROR: 'JoinError.UnknownError'
    }

exports.joinPage = function(req, res, next) {
	res.send("This is the join page");
	//TODO: return the joinCommunity page to client
};

exports.joinCommunity = function(req, res, next) {
	var userName = req.body.user_name;
	var password = req.body.password;
	if(!joinService.isPasswordValid(password)) {
		res.status(400).send(JSON.stringify({
		   	error_type:JOIN_ERROR.PASS_UNDER_QUALITY
		}));
	}
	else if(!joinService.isUserNameValid(userName)) {
		res.status(400).send(JSON.stringify({
		   	error_type:JOIN_ERROR.USER_NAME_UNDER_QUALITY
		}));
	}
	else {
		joinService.join(userName, password).then(function(result){
			switch(result.code) {
		    	case 200:
		        	res.send(JSON.stringify(result.body));
		        	break;
		    	case 204:
		        	res.status(204).send(JSON.stringify({}));
		        	break;
		    	case 400:
		    		res.status(400).send(JSON.stringify({
		    			error_type:JOIN_ERROR.INCORRECT_PASSWORD
		    		}));
		        	break;
		    	default:
		    		res.status(400).send(JSON.stringify({
		    			error_type:JOIN_ERROR.UNKNOWN_ERROR,
		    		}));
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

	joinService.confirm(userName, password)
		.then(function(result) {
			res.send(JSON.stringify(result));
		}).catch(function(err) {
			res.send(err);
		})
}
