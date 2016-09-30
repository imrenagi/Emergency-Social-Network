var express = require('express')
  , Message = require('../models/message')

exports.retrieveAllPublicMessages = function(req, res, next) {
  res.send(JSON.stringify({text: "Hello world"}));
};

