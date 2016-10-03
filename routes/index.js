var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('join', {title: 'Emergency Social Network'});
});

router.get('/welcome', function(req, res) {
  res.render('welcome', {title: 'Welcome - Emergency Social Network'});
});

router.use('/join', require('./join'));
router.use('/directory', require('./directory'));
router.use('/logout', require('./logout'));
router.use('/message', require('./message'));

module.exports = router;
