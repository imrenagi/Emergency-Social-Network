var express = require('express');
var router = express.Router();

//var join = require('./join');

router.get('/', function(req, res) {
  res.render('index', {title:"Emergency Social Network"});
});

router.use('/message', require('./sampleRoutes'));
router.use('/join', require('./join'));

module.exports = router;