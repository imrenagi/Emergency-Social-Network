var express = require('express');
var router = express.Router();
var app = express();

var render = require('../helpers/renderHelper');

router.get('/', function(req, res) {
    render.join(req, res);
});

router.get('/userDirectory', function(req, res) {
    render.requestAsCitizen(req, res, 'directory', {title: 'Public Wall - Emergency Social Network'});
});

router.get('/notification', function(req, res) {
    render.requestAsCitizen(req, res, 'privateChat', {title: 'Notification - Emergency Social Network', tab: 0, announce: 1});
});

router.get('/privateChat/:id', function(req, res) {
    var title = 'Chat - Emergency Social Network';
    render.requestAsCitizen(req, res, 'privateChat', {title: title, tab: req.params.id, announce: 0 });
});

router.get('/publicChat', function(req, res) {
    render.requestAsCitizen(req, res, 'publicChat', {title: 'Public Wall - Emergency Social Network'});
});

router.get('/welcome', function(req, res) {
    render.requestAsCitizen(req, res, 'welcome', {title: 'Welcome - Emergency Social Network'});
});

router.get('/searchInfo', function(req, res) {
    render.requestAsCitizen(req, res, 'search', { title: 'Search - Emergency Social Network'});
});

router.get('/news', function(req, res) {
    render.requestAsCitizen(req, res, 'news', { title: 'News - Emergency Social Network'});
});

router.get('/sendNews', function(req, res) {
    render.requestAsCitizen(req, res, 'sendNews', { title: 'News - Emergency Social Network'});
});

router.get('/userProfile', function(req, res) {
    render.requestAsAdmin(req, res, 'userProfile', { title: 'User Profile - Emergency Social Network'});
});

router.use('/join', require('./join'));
router.use('/directory', require('./directory'));
router.use('/logout', require('./logout'));
router.use('/message', require('./message'));
router.use('/announcement', require('./announcement'));
router.use('/search', require('./search'));
router.use('/administer', require('./admin'));


if (app.get('env') === 'test' || app.get('env') === 'circle') {
	router.use('/testing', require('./test'));
}

module.exports = router;
