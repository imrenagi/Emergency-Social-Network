var express = require('express')
  , Message = require('../models/message')

module.exports = {

    test: function(req, res, next) {
        var obj = {
    		firstName: "Hello",
    		secondName: "World"
  		}
  		res.send(JSON.stringify(obj));
    }
    // },
    // createUser: function(req, res, next) {
    //     User.create({ userName: req.body.userName }).then(function(user) {
    //         res.redirect("/users?userName="+user.get("userName"));
    //     });
    // }
};
