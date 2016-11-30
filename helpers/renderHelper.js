var express = require('express');
var router = express.Router();

exports.join = function(req, res, message) {
  if (req.session.user)
    res.render('directory', {title: 'Public Wall - Emergency Social Network'});
  else
    renderJoinPage(res, message);
}

exports.requestAsCitizen = function(req, res, template, data) {
    if (req.session.user)
        res.render(template, data);
    else
        renderJoinPage(res, 'Please login first');
}

exports.requestAsAdmin = function(req, res, template, data) {
    if (req.session.user) {
        if (req.session.user.privilage == 2)
            res.render(template, data);
        else
            res.render('directory', {title: 'Public Wall - Emergency Social Network'});
    }
    else
        renderJoinPage(res, 'Please login first');
}

function renderJoinPage(res, message) {
    res.render('join', {title: 'Emergency Social Network', message: message});
}
