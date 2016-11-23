
exports.isAuthorizedRequest = function (req, res, next) {
	if (req.session.user) {
		next();
  	}
  	else {
    	var err = new Error('Unauthorized request');
	  	err.status = 401;
	  	next(err);
  	}
};

exports.isAuthorizedAdminRequest = function (req, res, next) {
	if (req.session.user && req.session.user.privilage == 3) {
		next();
  	}
  	else {
    	var err = new Error('Unauthorized request');
	  	err.status = 401;
	  	next(err);
  	}
};
