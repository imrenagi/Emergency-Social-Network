var express = require('express');
var router = express.Router();
var publicChatController = require('../controllers/publicChatController');

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

module.exports = router;

