var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mxlog = require('./global/maixianlog');


var wxlogin = require('./routes/wxlogin');
var indexRouter = require('./routes/index');
var categoryRouter = require('./routes/category');
var bannerRouter = require('./routes/banner');
var itemdetail = require('./routes/itemdetail');
var order = require('./routes/order');
var address = require('./routes/address');
var usersRouter = require('./routes/users');
var groupdetail = require('./routes/groupdetail');

var mongoose = require('mongoose').set('debug', true);
mongoose.Promise = require('bluebird');

const dburl = require('./global/serverconfig').dbconfig.url;
const connect = mongoose.connect(dburl);

connect.then((db) => {
	mxlog.getLogger('log_date').info('Connected correctly to db server');
}, (err) => { mxlog.getLogger('console').info(err);});

const redis = require('./global/redis');
redis.connettoredis('127.0.0.1', '6379');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/category', categoryRouter);
app.use('/banner', bannerRouter);
app.use('/item', itemdetail);
app.use('/wxlogin', wxlogin);
app.use('/order', order);
app.use('/users', usersRouter);
app.use('/groupdetail', groupdetail);
app.use('/address', address);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	res.send({status:0, error:err});
	// set locals, only providing error in development
	/*res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');*/
});

module.exports = app;
