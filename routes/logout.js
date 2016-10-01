var express = require('express');
var router = express.Router();

router.delete('/', function(req, res, next) {
	if (req.session.user_name) {
		req.session = null;
  		return res.json({});
  	}
  	else {
    	res.status(401).send(JSON.stringify({}));
  	}
	
});

module.exports = router;