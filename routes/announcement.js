var express = require('express');
var router = express.Router();
var announcementController = require('../controllers/announcementController');

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

// router.get('/', joinController.joinPage);
//router.post('/', announcementController.createAnnouncement);


module.exports = router;