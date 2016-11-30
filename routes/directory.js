var express = require('express');
var router = express.Router();
var directoryController = require('../controllers/directoryController');

var auth = require('../middleware/authorization');
router.use(auth.isAuthorizedRequest);


router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/', directoryController.displayDirectory);
router.get('/user/:id', directoryController.getUser);
router.put('/user/:id/status', directoryController.updateStatus);
router.get('/user_email', directoryController.getUserEmail);
router.put('/user/email', directoryController.updateEmail);

module.exports = router;