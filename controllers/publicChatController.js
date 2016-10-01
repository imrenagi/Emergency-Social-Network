var publicChatServiceImpl = require('../services/publicChatServiceImpl');
var publicChatService = new publicChatServiceImpl();


exports.publicChat = function(req, res, next) {
	//TODO: return the public chat page with previous messages to client 
	publicChatService.getPreviousMessages().then(function(result) {
		res.send(JSON.stringfy(result));
	});
};

exports.publicChatSocket = function(socket) {
	console.log('A user elects to chat public');

	//Update the chat box when a user post a new messaage and finish the persistence operation 
	socket.on('post message', function(newMessage) {
		console.log('user posts a message');
	});

	//Update the online userList when the user leave
	socket.on('leave', function() {
		console.log('user ends chat publicly');
	});
};