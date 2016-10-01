
var direcotryServiceImpl = require('../services/directoryServiceImpl');
var direcotryService = new direcotryServiceImpl();


exports.displayDirectory = function(req, res, next) {
	var limit = req.param('limit') || 20;
	direcotryService.getDirectory(limit).then(function(result) {
		res.send(JSON.stringify(result));
	})
}