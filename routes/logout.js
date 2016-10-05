var express = require('express');
var router = express.Router();
var logoutController = require('../controllers/logoutController');

var auth = require('../middleware/authorization');
router.use(auth.isAuthorizedRequest);


router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.delete('/', logoutController.logout);

module.exports = router;