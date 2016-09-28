var express = require('express');
var router = express.Router();
var directoryController = require('../controllers/directoryController');

router.get('/', directoryController.displayDirectory);