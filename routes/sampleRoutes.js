var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messages');

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/', messageController.test); 
// router.post('/', userController.createUser);    /* POST create user */

module.exports = router;