"use strict";

var R = require('ramda');
var db = require('../services/db');
var User = require('../models/user');
var Location = require('../models/location');
var Message = require('../models/message');
var dateHelper = require('../helpers/date');

var PublicMessageService = require('./interfaces/publicMessageService');

class PublicMessageServiceImpl extends PublicMessageService {
	constructor(db) {
		super();
		this.db = db;
	}
	
	getAllMessages(lastId, limit) {
		var query = '';
		if (lastId === -1) {
			query = 'SELECT pm.*, u.user_name FROM public_messages pm LEFT JOIN users u ON pm.sender_id = u.id order by pm.id desc limit ' + limit	
		} else {
			query = 'SELECT pm.*, u.user_name FROM public_messages pm LEFT JOIN users u ON pm.sender_id = u.id where pm.id >='+ (lastId-limit) + ' and pm.id < ' + lastId + ' order by pm.id desc'
		}
		var that = this;
		return new Promise(function(resolve, reject) {
			that.db.get().query(query, function(err, result) {
				if (err) reject(err);
				else {
					var results = JSON.parse(JSON.stringify(result));
					var out = R.map(function(rawMessage) {
						var location = new Location(rawMessage.latitude, rawMessage.longitude);
						var user = new User(rawMessage.sender_id, rawMessage.user_name, rawMessage.online, rawMessage.status);
						var message = new Message(rawMessage.id, 
							user,
							rawMessage.message,
							dateHelper.convertDateToTimestamp(rawMessage.created_at),
							parseInt(rawMessage.message_status),
							location)
						return message;
					}, results);
					resolve(out);
				}
			})
		})
	}

	storeMessage(senderId, message, message_status, lat, long) {
		var that = this;
		return new Promise(function(resolve, reject) {
			let query = 'INSERT INTO public_messages (sender_id, message, message_status, latitude, longitude) VALUES (?,?,?,?,?)';
			let values = [senderId, message, message_status, lat, long]
			that.db.get().query(query, values, function(err, result) {
				if (err) {
					reject(err)
				}
				else {
					var results = JSON.parse(JSON.stringify(result));
					let insertedId = results.insertId
					resolve(insertedId);
				}
			});
		}).then(function(result) {
			return new Promise(function(resolve, reject) {
				let query = 'SELECT pm.*, u.user_name FROM public_messages pm LEFT JOIN users u ON pm.sender_id = u.id where pm.id = ?'
				that.db.get().query(query, result, function(err, result) {
					if (err) reject(err);
					else {
						var res = JSON.parse(JSON.stringify(result));
						var rawMessage = res[0];
						var location = new Location(rawMessage.latitude, rawMessage.longitude);
						var user = new User(rawMessage.sender_id, rawMessage.user_name, rawMessage.online, rawMessage.status);
						var message = new Message(rawMessage.id, 
							user,
							rawMessage.message,
							dateHelper.convertDateToTimestamp(rawMessage.created_at),
							parseInt(rawMessage.message_status),
							location);
						resolve(message)
					}
				})
			})
		});
	}



}

module.exports = PublicMessageServiceImpl;
