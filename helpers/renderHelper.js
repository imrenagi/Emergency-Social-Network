var express = require('express');
var router = express.Router();

exports.join = function(req, res) {
  if (req.session.user)
    res.render('directory', {title: 'Public Wall - Emergency Social Network'});
  else
    renderJoinPage(res, '');
}

exports.requestAsCitizen = function(req, res, template, data) {
    if (req.session.user)
        res.render(template, data);
    else
        renderJoinPage(res, 'Please login first');
}

function renderJoinPage(res, message) {
    res.render('join', {title: 'Emergency Social Network', message: message});
}
