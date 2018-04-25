var express = require('express');
var router = express.Router();
const pagenum = require('../global/serverconfig').pagenum;

var itemlists = require('../models/itemlists');

router.get('/:pageid', function(req, res, next) {
	var pageid = req.params.pageid;

	itemlists.find({}).sort("-sales").skip(pageid * pagenum).limit(pagenum)
	.then((items) => {
		res.send({status:1, len:items.length, lists:items});
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = router;
