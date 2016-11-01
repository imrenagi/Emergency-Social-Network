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


router.get('/users_setup', function(req, res, next) {

});


router.get('/public_messages_setup', function(req, res, next) {
	db.get().query('INSERT INTO public_messages (sender_id, message, message_status, latitude, longitude) VALUES (1, "test message", 0, 100, 100)', 
		function(err, result) {
		if (err) res.send(err)
		else res.send(result)
	});
});


module.exports = router;