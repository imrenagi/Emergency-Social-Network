var express = require('express');
var router = express.Router();
var directoryController = require('../controllers/directoryController');

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/', directoryController.displayDirectory);

module.exports = router;