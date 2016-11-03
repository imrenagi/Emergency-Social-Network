var express = require('express');
var router = express.Router();
var app = express();

router.get('/', function(req, res) {
  res.render('join', {title: 'Emergency Social Network'});
});

router.get('/userDirectory', function(req, res) {
  res.render('directory', {title: 'Public Wall - Emergency Social Network'});
});

router.get('/notification', function(req, res) {
  res.render('privateChat', {title: 'Notification - Emergency Social Network', tab: 0, announce: 1});
});

router.get('/privateChat/:id', function(req, res) {
  var title = 'Chat - Emergency Social Network';
  res.render('privateChat', {title: title, tab: req.params.id, announce: 0 });
});

router.get('/publicChat', function(req, res) {
  res.render('publicChat', {title: 'Public Wall - Emergency Social Network'});
});

router.get('/welcome', function(req, res) {
  res.render('welcome', {title: 'Welcome - Emergency Social Network'});
});

router.get('/searchInfo', function(req, res) {
  res.render('search', { title: 'Search - Emergency Social Network'});
});

router.use('/join', require('./join'));
router.use('/directory', require('./directory'));
router.use('/logout', require('./logout'));
router.use('/message', require('./message'));
router.use('/announcement', require('./announcement'));
router.use('/search', require('./search'));

if (app.get('env') === 'test' || app.get('env') === 'circle') {
	router.use('/testing', require('./test'));
}

module.exports = router;
