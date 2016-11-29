const RESERVED_USERNAMES = require('../utils/reservedUsernames');

exports.isUserNameValid = function(userName) {
		if(userName.length < 3) {
			return false;
		}
		for (var i in RESERVED_USERNAMES) {
  			if(userName.toLowerCase() == RESERVED_USERNAMES[i]) {
				return false;
			}
		}
		return true;
}

exports.isPasswordValid = function(password) {
	if(password.length < 4) {
		return false;
	}
	return true;
}

exports.isValidPrivilage = function(privilage) {
	return (privilage == 0 || privilage == 1 || privilage == 2);
}

exports.isValidActiveStatus = function(status) {
	return (status == 0 || status == 1);
}