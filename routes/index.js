var express = require('express');
var router = express.Router();

var itemlists = require('../models/itemlists');

router.get('/', function(req, res, next) {
	var start = req.query.start;
	var end = req.query.end;

	itemlists.find({}).sort("-sales")
	.then((items) => {
		start = Math.max(0, start);
		end = Math.min(end, items.length);
		res.send({status:1, end:end, lists:items.slice(start, end)});
	}, (err) => next(err))
	.catch((err) => next(err));
});

router.post('/', function(req, res, next) {
	itemlists.create(req.body)
	.then((item) => {
		res.send({status:1, item:item});
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = router;
