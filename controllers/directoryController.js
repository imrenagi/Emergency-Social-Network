
var direcotryServiceImpl = require('../services/directoryServiceImpl');
var direcotryService = new direcotryServiceImpl();


exports.displayDirectory = function(req, res, next) {
	var page = req.param('page') || 1;
	var limit = req.param('limit') || 100;
	direcotryService.getDirectory(page, limit).then(function(result) {
		res.send(JSON.stringify(result));
	})
}