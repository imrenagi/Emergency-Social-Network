var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController');

var isAuthorizedRequest = function (req, res, next) {
	if (req.session.user_name) {
		next();
  	}
  	else {
    	var err = new Error('Unauthorized request');
	  	err.status = 401;
	  	next(err);
  	}
};

router.use(isAuthorizedRequest);

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/public', messageController.retrieveAllPublicMessages);

module.exports = router;