'use strict'

var express = require('express')
var PublicMessageServiceImpl = require('./publicMessageServiceImpl');
var publicMessageService = new PublicMessageServiceImpl();
var db = require('./db');

var AnnouncementDAOImpl = require('./announcementDAOImpl');
var announcementDAO = new AnnouncementDAOImpl(db);
var AnnouncementServiceImpl = require('./announcementServiceImpl');
var announcementService = new AnnouncementServiceImpl(announcementDAO);
var PrivateMessageDAOImpl = require('./privateMessageDAOImpl');
var privateMessageDAO = new PrivateMessageDAOImpl(db);
var PrivateMessageServiceImpl = require('./privateMessageServiceImpl');
var privteMessageService = new PrivateMessageServiceImpl(privateMessageDAO);

var io = require('../bin/www').io;

//Store all online users' socket
var users = new Map();

const MESSAGE_ERROR = {
        EMPTY_SENDER_OR_MESSAGE: 'MessageError.EmptySenderNameOrMessage',
		UNKNOWN_ERROR: 'MessageError.UnknownError',
		MYSQL_EXCEPTION: 'MessageError.InvalidMessageData',
		EMPTY_SENDER_OR_RECEIVER_MESSAGE: 'MessageError.EmptySenderOrReceiverOrMessage'
    }

const ANNOUNCEMENT_ERROR = {
	EMPTY_SENDER_OR_ANNOUNCEMENT: 'Announcement.EmptySenderIdOrAnnouncement',
	UNKNOWN_ERROR: 'Announcement.Unknown'
}

exports.onListening = function(socket) {

	socket.on('new socket', function(data) {
		socket.userId = data.user_id;
		socket.userName = data.user_name;
		users.set(socket.userId, socket);
	});

	socket.on('disconnect', function(){
		users.delete(socket.user_id);
 	});

  	socket.on('new login', function(username){
  		socket.username = username;
  	});

  	socket.on('profile update', function(data) {
  		var userId = data.user_id || '';
  		if(users.has(userId)) {
			users.get(userId).emit('force logout');
		}
  	})

  	socket.on('send message', function(data) {
  		var senderId = data.sender_id;
		var message = data.message;
		var message_status = data.message_status || 0;
		var latitude = data.latitude || null;
		var longitude = data.longitude || null;

		if (senderId === undefined || message === undefined) {
			var err = new Error();
	  		err.status = 400;
	  		err.message = MESSAGE_ERROR.EMPTY_SENDER_OR_MESSAGE;
	  		return console.log(err);
		}
		publicMessageService.storeMessage(senderId, message, message_status, latitude, longitude)
		.then(function(results) {
			io.emit('broadcast message', JSON.stringify(results));
		}).catch(function(err) {
			return console.log(err);
		});
  	});

  	socket.on('post announcement', function(data) {
  		if (data.sender_id === undefined || data.message === undefined) {
			var err = new Error();
	  		err.status = 400;
	  		err.message = ANNOUNCEMENT_ERROR.EMPTY_SENDER_OR_ANNOUNCEMENT;
	  		return console.log(err);
		}
		
  		announcementService.post(data.sender_id, data.message, data.lat, data.long).then(function(id) {
  			announcementService.getByAnnouncementId(id).then(function(result) {
  				io.emit('broadcast announcement', result);
  			}).catch(function(err){
  				return console.log(err)
  			});
  		}).catch(function(err) {
  			return console.log(err);
  		});
  	});

  	socket.on('update message read_flag', function(data) {
  		privteMessageService.updateMessageReadFlag(data);
  	});

  	socket.on('send private message', function(data, callback) {
  		var senderId = socket.userId;
  		var senderName = socket.userName;

  		var receiverId = data.receiver_id;
  		var receiverName = data.receiver_name;
  		var conversationId = data.conversation_id;
  		var message = data.message;
  		var messageStatus = data.message_status || 0;
  		var latitude = data.latitude || null;
		var longitude = data.longitude || null;

		if(senderId === undefined || message === undefined || receiverId === undefined) {
			var err = new Error();
	  		err.status = 400;
	  		err.message = MESSAGE_ERROR.EMPTY_SENDER_OR_RECEIVER_MESSAGE;
	  		return console.log(err);
		}

		if(conversationId === undefined) {
			privteMessageService.getConversationId(senderId, receiverId).then(function(result) {
				if(result.length === 0) {
					privteMessageService.createConversation(senderId, receiverId).then(function(results) {
						conversationId = results;
						callback(conversationId);
						privteMessageService.storePrivateMessage(senderId, senderName, receiverId, receiverName, conversationId, message, messageStatus, latitude, longitude)
						.then(function(privateMessage) {
							if(users.has(receiverId)) {
								users.get(receiverId).emit('receive private message', privateMessage, function(data) {
									privteMessageService.updateMessageReadFlag(data);
								});
								users.get(receiverId).emit('notification');
							}
						}).catch(function(err) {
							return console.log(err);
						});
					}).catch(function(err) {
						return console.log(err); 
					});
				}
				else {
					conversationId = result[0];
					privteMessageService.storePrivateMessage(senderId, senderName, receiverId, receiverName, conversationId, message, messageStatus, latitude, longitude)
					.then(function(privateMessage) {
						if(users.has(receiverId)) {
							users.get(receiverId).emit('receive private message', privateMessage, function(data) {
								privteMessageService.updateMessageReadFlag(data);
							});
							users.get(receiverId).emit('notification');
						}
					}).catch(function(err) {
						return console.log(err);
					});
				}
			});
		}
		else {
			privteMessageService.storePrivateMessage(senderId, senderName, receiverId, receiverName, conversationId, message, messageStatus, latitude, longitude)
			.then(function(privateMessage) {
				console.log(privateMessage);
				if(users.has(receiverId)) {
					users.get(receiverId).emit('receive private message', privateMessage, function(data) {
						privteMessageService.updateMessageReadFlag(data);
					});
					users.get(receiverId).emit('notification');
				}
			}).catch(function(err) {
				return console.log(err);
			});
		} 		
  	});

}
