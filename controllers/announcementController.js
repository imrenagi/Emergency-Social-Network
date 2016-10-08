var AnnouncementServiceImpl = require('../services/announcementServiceImpl');
var AnnouncementDAOImpl = require('../services/announcementDAOImpl');

var announcementDAO = new AnnouncementDAOImpl();
var announcementService = new AnnouncementServiceImpl(announcementDAO);

exports.retrieveAnnouncements = function(req, res, next) {
	var lastId = req.param('last_id') || -1;
  	var limit = req.param('limit') || 30;
  
  	announcementService.getAllAnnouncements(lastId, limit)
	  	.then(function(results) {

	  		console.log(results);
	      	res.send(JSON.stringify(results));
	    }).catch(function(err) {
	      res.send(err);
	    })
}