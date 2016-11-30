var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser('1M6QMy7359Cyopz9hv8MsAGf2cio2yb2'))
app.use(session({secret: 't6oCe14uH8tPO8Fr3c7z1qGWFP0mEeN3'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname+ '/bower_components')));
//app.use(require('./controllers'));
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    errorCode = err.status || 500;
    res.status(errorCode);
    if (errorCode === 401 || errorCode === 400) {
      res.send(JSON.stringify(err))
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.render('error', {
          message: err.message,
          error: err
        });
    }
  });
}

app.use(function(err, req, res, next) {
    errorCode = err.status || 500;
    res.status(errorCode);
    if (errorCode === 401 || errorCode === 400) {
      res.send(JSON.stringify(err))
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.render('error', {
          message: {},
          error: err
        });
    }
  });


module.exports = app;
