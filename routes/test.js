var express = require('express');
var router = express.Router();
var db = require('../services/db')

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/users', function(req, res, next) {
	db.get().query('delete from announcements', function(err, result) {
		if(err) {
			console.log(err);
			res.send(err);
		}
		else {
			db.get().query('delete from public_messages', function(err, result) {
				if (err) {
					console.log(err);
					res.send(err);
				}
				else {
					db.get().query('delete from users', function(err, result) {
						if (err) {
							console.log(err);
							res.send(err);
						}
						else {
							res.send(result)
						}
					});
				}
			});
		}
	});
});


router.get('/setup_users', function(req, res, next) {
	db.get().query('INSERT INTO users (id, user_name, password, online, status) VALUES (1, "Sam", "12345", 0, 1)', function(err, result) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		else {
			console.log(result);
			res.send(result)
		}
	});
});


router.get('/setup_public_messages', function(req, res, next) {
	db.get().query('INSERT INTO users (id, user_name, password, online, status) VALUES (1, "Sam", "12345", 0, 1)', function(err, result) {
		if (err) res.send(err)
		else {
			db.get().query('INSERT INTO public_messages (sender_id, message, message_status, latitude, longitude) VALUES (?, "test message", 0, 100, 100)', result.insertId, function(err, result) {
				if (err) res.send(err)
				else res.send(result)
			});
		}
	});
	
});


module.exports = router;