
var userDAOImpl = require('../services/userDAOImpl');
var userDAO = new userDAOImpl();

exports.logout = function(req, res, next) {
	let id = req.session.user.id || 0;
	userDAO.updateOnline(id, 0);
	req.session = null;
  	return res.json({});
}