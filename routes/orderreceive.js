var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');

const mongoose = require('mongoose');
const orders = require('../models/orders');
const users = require('../models/users');

router.post('/:orderid', authenticate, function(req, res, next) {
	orders.findByIdAndUpdate(req.params.orderid, {$set:{status:3}})
	.then((order) => {
		return res.send({status:1});
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = router;
