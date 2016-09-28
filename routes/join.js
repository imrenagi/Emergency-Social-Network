var express = require('express');
var router = express.Router();
var joinController = require('../controllers/joinController');

router.get('/', joinController.joinPage);
router.post('/', joinController.joinCommunity);
router.post('/confirm', joinController.confirm);


module.exports = router;