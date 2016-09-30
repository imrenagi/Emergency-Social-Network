"use strict";

var R = require('ramda');
var db = require('../services/db');
var User = require('../models/user');
var Location = require('../models/location');
var Message = require('../models/message');
var dateHelper = require('../helpers/date');

var PublicMessageService = require('./interfaces/publicMessageService');

class PublicMessageServiceImpl extends PublicMessageService {
	constructor() {
		super();
	}
	
	getAllMessages(page, limit) {
		return new Promise(function(resolve, reject) {
			db.get().query('SELECT pm.*, u.user_name FROM public_messages pm ' +
				'LEFT JOIN users u ON pm.sender_id = u.id limit ?', limit, function(err, result) {
				if (err) reject(err);
				else {
					var results = JSON.parse(JSON.stringify(result));
					var out = R.map(function(rawMessage) {
						var location = new Location(rawMessage.latitude, rawMessage.longitude);
						var user = new User(rawMessage.sender_id, rawMessage.user_name);
						var message = new Message(rawMessage.id, 
							user,
							rawMessage.message,
							dateHelper.convertDateToTimestamp(rawMessage.created_at),
							rawMessage.message_status,
							location)
						return message;
					}, results)
					resolve(out);
				}
			})
		})
	}
}

module.exports = PublicMessageServiceImpl;
