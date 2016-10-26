var userDAOImpl = require('../services/userDAOImpl');
var SearchServiceImpl = require('../services/searchServiceImpl');

var userDAO = new userDAOImpl();
var searchService = new SearchServiceImpl(userDAO);

exports.search = function(req, res, next) {
	var search_type = req.param('search_type')
	var query = req.param('query') || 0
	var page = req.param('page') || 1;
  	var limit = req.param('limit') || 30;
	
	if (!isValidSeachType(search_type)) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = "Bad search type"
	  	next(err);
	}

	switch (search_type) {
		case 'user_name':
			searchByUserName(req, res, next, query, page, limit);
			break;
		case 'user_status':
			searchByUserStatus(req, res, next, query, page, limit);
			break;
	}
}

function isValidSeachType(type) {
	var isValid = false
	if (type === undefined) {
		return false
	}
	if (type === 'announcement' || type === 'user_name' 
		|| type === 'user_status' || type === 'private_message'
		|| type === 'public_message') {
		isValid = true;
	}
	return isValid;
}

function searchByUserName(req, res, next, userName, page, limit) {
	searchService.userByName(userName, page, limit).then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err){
		res.send(err)
	})
}

function searchByUserStatus(req, res, next, status, page, limit) {
	searchService.userByStatus(status, page, limit).then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err){
		res.send(err)
	})
}