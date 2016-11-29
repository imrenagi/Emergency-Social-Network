var express = require('express');
var router = express.Router();
var newsController = require('../controllers/newsController');

var auth = require('../middleware/authorization');
router.use(auth.isAuthorizedRequest);

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/news', newsController.getAllNews);
router.post('/news', newsController.createNews);

module.exports = router;