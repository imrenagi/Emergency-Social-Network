var express = require('express');
var router = express.Router();
var joinController = require('../controllers/joinController');

router.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
})

router.get('/', joinController.joinPage);
router.post('/', joinController.joinCommunity);
router.post('/confirm', joinController.confirm);


module.exports = router;
