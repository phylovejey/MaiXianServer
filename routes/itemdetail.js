var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const itemlists = require('../models/itemlists');

/* GET home page. */
router.get('/:itemid', function(req, res, next) {
	itemlists.findById(req.params.itemid)
	.then((item) => {
		res.send({status:1, detail:item});
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = router;
