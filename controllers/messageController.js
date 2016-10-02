var express = require('express')
  , PublicMessageServiceImpl = require('../services/publicMessageServiceImpl');

var publicMessageService = new PublicMessageServiceImpl();

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

exports.publicChatSocket = function(socket) {
	console.log('A user elects to chat public');

	//Update the chat box when a user post a new messaage and finish the persistence operation 
	socket.on('post message', function(newMessage) {
		console.log('user posts a message');
		publicMessageService.postMessage(newMessage);
	
	});

	//Update the online userList when the user leave
	socket.on('leave', function() {
		console.log('user ends chat publicly');
	});
};

