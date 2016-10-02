
exports.logout = function(req, res, next) {
	
	req.session = null;
  	return res.json({});
}