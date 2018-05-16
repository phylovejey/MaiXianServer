var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');

const mongoose = require('mongoose');
const orders = require('../models/orders');
const users = require('../models/users');

router.get('/:itemid', authenticate, function(req, res, next) {
	orders.find({status: 1, purchaseitem: req.params.itemid}).populate('consumer').populate('purchaseitem')
	.then((orders) => {
		return res.send({status:1, list:orders, user_openid:req.user.openid});
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = router;
