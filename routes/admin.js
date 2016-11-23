var express = require('express');
var router = express.Router();
var adminController = require('../controllers/administerUserProfileController');

var auth = require('../middleware/authorization');
router.use(auth.isAuthorizedRequest);
// router.use(auth.isAuthorizedAdminRequest);

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/user', adminController.getUsers);
router.put('/user/:id', adminController.updateUser);

module.exports = router;