'use strict';

var userDAOImpl = require('../services/userDAOImpl');
var User = require('../models/user');
var db = require('../services/db');
var userDAO = new userDAOImpl(db);

exports.logout = function(req, res, next) {
	let id = req.session.user.id || 0;
	let user_name = req.session.user.user_name;
	var user = new User(id, user);
	userDAO.updateOnline(user, 0).then(result => {
		req.session = null;
		res.send(JSON.stringify({}))	
	}).catch(err => {
		console.log(err);
		next(err);
	});
	
}