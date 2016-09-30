var express = require('express')
  , PublicMessageServiceImpl = require('../services/publicMessageServiceImpl');

var publicMessageService = new PublicMessageServiceImpl();

exports.retrieveAllPublicMessages = function(req, res, next) {
  var page = req.params.page || 1;
  var limit = req.params.limit || 30;
  publicMessageService.getAllMessages(page, limit)
    .then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.send(err);
    })
};

