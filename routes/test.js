var express = require('express');
var router = express.Router();
var db = require('../services/db')

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/users', function(req, res, next) {
	db.get().query('delete from users', function(err, result) {
		if (err) res.send(err)
		else res.send(result)
	});
});


module.exports = router;