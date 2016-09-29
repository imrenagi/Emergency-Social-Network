
var direcotryServiceImpl = require('../services/directoryServiceImpl');
var direcotryService = new direcotryServiceImpl();


exports.displayDirectory = function(req, res, next) {
	direcotryService.getDirectory().then(function(result) {
		res.send(JSON.stringify(result));
	})
}