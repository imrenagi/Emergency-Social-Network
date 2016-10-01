var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController');

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/public', messageController.retrieveAllPublicMessages);

module.exports = router;