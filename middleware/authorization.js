
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
