var userDAOImpl = require('../services/userDAOImpl');
var AnnouncementDAOImpl = require('../services/announcementDAOImpl');
var PublicMessageDAOImpl = require('../services/publicMessageDAOImpl');
var PrivateMessageDAOImpl = require('../services/privateMessageDAOImpl');
var SearchServiceImpl = require('../services/searchServiceImpl');


var announcementDAO = new AnnouncementDAOImpl();
var userDAO = new userDAOImpl();
var publicMessageDAO = new PublicMessageDAOImpl();
var privateMessageDAO = new PrivateMessageDAOImpl();
var searchService = new SearchServiceImpl(userDAO, announcementDAO, publicMessageDAO, privateMessageDAO);


exports.search = function(req, res, next) {
	var search_type = req.param('search_type')
	var rawQuery = req.param('query') || ''
	var query = rawQuery.toLowerCase()
	//var query = req.param('query').toLowerCase() || ''
	var page = req.param('page') || 1;
  	var limit = req.param('limit') || 30;
	
  	console.log('hgHJG');

	if (!isValidSeachType(search_type)) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = "Bad search type"
	  	console.log(err);
	  	next(err);
	}

	switch (search_type) {
		case 'user_name':
			searchByUserName(req, res, next, query, page, limit);
			break;
		case 'user_status':
			searchByUserStatus(req, res, next, query, page, limit);
			break;
		case 'announcement':
			searchByAnnouncement(req, res, next, query, page, limit);
			break;
		case 'public_message':
			searchByPublicMessage(req, res, next, query, page, limit);
			break;
		case 'private_message':
			searchByPrivateMessage(req, res, next, query, page, limit);
			break;
		default:
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

function searchByAnnouncement(req, res, next, query, page, limit) {
	searchService.announcementByQuery(query, page, limit).then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err){
		res.send(err)
	})
}

function searchByPublicMessage(req, res, next, query, page, limit) {
	searchService.publicMessageByQuery(query, page, limit).then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err) {
		res.send(err);
	});
}

function searchByPrivateMessage(req, res, next, query, page, limit) {
	var userId = req.session.user.id;
	searchService.privateMessageByQuery(userId, query, page, limit).then(function(result) {
		res.send(JSON.stringify(result));
	}).catch(function(err) {
		res.send(err);
	});
}
