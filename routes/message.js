var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController');

var auth = require('../middleware/authorization');
router.use(auth.isAuthorizedRequest);

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/public', messageController.retrieveAllPublicMessages);
router.post('/public', messageController.sendMessage);

module.exports = router;