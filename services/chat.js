var express = require('express')
var PublicMessageServiceImpl = require('./publicMessageServiceImpl');
var publicMessageService = new PublicMessageServiceImpl();

var AnnouncementDAOImpl = require('./announcementDAOImpl');
var announcementDAO = new AnnouncementDAOImpl();
var AnnouncementServiceImpl = require('./announcementServiceImpl');
var announcementService = new AnnouncementServiceImpl(announcementDAO);


var io = require('../bin/www').io;

const MESSAGE_ERROR = {
        EMPTY_SENDER_OR_MESSAGE: 'MessageError.EmptySenderNameOrMessage',
		UNKNOWN_ERROR: 'MessageError.UnknownError',
		MYSQL_EXCEPTION: 'MessageError.InvalidMessageData'
    }

const ANNOUNCEMENT_ERROR = {
	EMPTY_SENDER_OR_ANNOUNCEMENT: 'Announcement.EmptySenderIdOrAnnouncement',
	UNKNOWN_ERROR: 'Announcement.Unknown'
}


exports.onListening = function(socket) {

	socket.on('disconnect', function(){

 	 });

  	socket.on('new login', function(username){
  		socket.username = username;
  	});

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
  		if (senderId === undefined || message === undefined) {
			var err = new Error();
	  		err.status = 400;
	  		err.message = ANNOUNCEMENT_ERROR.EMPTY_SENDER_OR_ANNOUNCEMENT;
	  		return console.log(err);
		}
  		announcementService.save(data).then(function(result) {
  			announcementService.getByAnnouncementId(result).then(function(result) {
  				io.emmit('broadcast announcement', result);
  			});
  		}).catch(function(err) {
  			return console.log(err);
  		});
  	});

}