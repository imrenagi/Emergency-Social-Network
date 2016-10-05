
var direcotryServiceImpl = require('../services/directoryServiceImpl');
var direcotryService = new direcotryServiceImpl();


exports.displayDirectory = function(req, res, next) {
	var page = req.param('page') || 1;
	var limit = req.param('limit') || 100;
	direcotryService.getDirectory(page, limit).then(function(result) {
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
		direcotryService.getUser(userId).then(function(result) {
			res.status(200).send(JSON.stringify(result))
		}).catch(function(err) {
			next(err)
		}) 
	}
}
