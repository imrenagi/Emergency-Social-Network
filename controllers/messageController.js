var express = require('express')
  , PublicMessageServiceImpl = require('../services/publicMessageServiceImpl');

var publicMessageService = new PublicMessageServiceImpl();

const MESSAGE_ERROR = {
        EMPTY_SENDER_OR_MESSAGE: 'MessageError.EmptySenderNameOrMessage',
		UNKNOWN_ERROR: 'MessageError.UnknownError',
		MYSQL_EXCEPTION: 'MessageError.InvalidMessageData'
    }

exports.retrieveAllPublicMessages = function(req, res, next) {
  var lastId = req.param('last_id') || -1;
  var limit = req.param('limit') || 30;
  publicMessageService.getAllMessages(lastId, limit)
    .then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.send(err);
    })
};

exports.sendMessage = function(req, res, next) {
	var senderId = req.param('sender_id');
	var message = req.param('message');
	var message_status = req.param('message_status') || 1;
	var latitude = req.param('latitude') || null;
	var longitude = req.param('longitude') || null;

	if (senderId === undefined || message === undefined) {
		var err = new Error();
	  	err.status = 400;
	  	err.message = MESSAGE_ERROR.EMPTY_SENDER_OR_MESSAGE;
	  	next(err);
	}

	publicMessageService.storeMessage(senderId, message, message_status, latitude, longitude)
		.then(function(results) {
			res.send(JSON.stringify(results))
		}).catch(function(err) {
			var err = new Error();
		  	err.status = 400;
		  	err.message = MESSAGE_ERROR.MYSQL_EXCEPTION;
		  	next(err);
		})
}

