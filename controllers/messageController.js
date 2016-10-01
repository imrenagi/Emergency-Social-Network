var express = require('express')
  , PublicMessageServiceImpl = require('../services/publicMessageServiceImpl');

var publicMessageService = new PublicMessageServiceImpl();

exports.retrieveAllPublicMessages = function(req, res, next) {
  var lastId = req.param('last_id') || -1;
  var limit = req.param('limit') || 30;
  publicMessageService.getAllMessages(lastId, limit)
    .then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.send(err);
    })
};

