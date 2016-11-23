var directoryServiceImpl = require('../services/directoryServiceImpl');
var directoryService = new directoryServiceImpl();

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