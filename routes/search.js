var express = require('express');
var router = express.Router();
var searchController = require('../controllers/searchController');

var auth = require('../middleware/authorization');
router.use(auth.isAuthorizedRequest);

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/:search_type', searchController.search);

module.exports = router;