var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/', function(req, res) {
  res.render('index', {title:"Emergency Social Network"});
});

router.use('/message', require('./sampleRoutes'));
router.use('/join', require('./join'));

module.exports = router;