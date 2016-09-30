var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {title:"Emergency Social Network"});
});

router.use('/join', require('./join'));
router.use('/directory', require('./directory'));
router.use('/message', require('./message'));

module.exports = router;