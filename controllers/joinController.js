var JoinService = require('../services/joinService');
var joinService = new JoinService();

exports.joinPage = function(req, res) {
	res.send("This is the join page");
	//TODO: return the joinCommunity page to client
};

exports.joinCommunity = function(req, res) {
	var userName = req.body.user_name;
	var password = req.body.password;
	joinService.isValid();
	res.send("ok!");
};

