var express = require('express')
  , router = express.Router()

router.use('/message', require('../routes/sampleRoutes'));

router.get('/', function(req, res) {
  res.render('index', {title:"Emergency Social Network"});
})

module.exports = router