'use strict';

var userDAOImpl = require('../services/userDAOImpl');
var User = require('../models/user');
var userDAO = new userDAOImpl();

exports.logout = function(req, res, next) {
	let id = req.session.user.id || 0;
	let user_name = req.session.user.user_name;
	var user = new User(id, user);
	userDAO.updateOnline(user, 0);
	req.session = null;
  	return res.json({});
}