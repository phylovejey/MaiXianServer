var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var wxlogin = require('./routes/wxlogin');
var indexRouter = require('./routes/index');
var itemdetail = require('./routes/itemdetail');
var order = require('./routes/order');
var usersRouter = require('./routes/users');

var mongoose = require('mongoose').set('debug', true);
mongoose.Promise = require('bluebird');

const dburl = require('./global/serverconfig').dbconfig.url;
const connect = mongoose.connect(dburl);

connect.then((db) => {
	console.log('Connected correctly to server');
}, (err) => { console.log(err);});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/wxlogin', wxlogin);
app.use('/index', indexRouter);
app.use('/item', itemdetail);
app.use('/order', order);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
