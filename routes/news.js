var express = require('express');
var router = express.Router();
var newsController = require('../controllers/newsController');

var auth = require('../middleware/authorization');
router.use(auth.isAuthorizedRequest);

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/', newsController.getAllNews);
router.post('/', newsController.createNews);
router.get('/:id', newsController.getNewsById);

module.exports = router;