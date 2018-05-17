var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');

const orders = require('../models/orders');
const users = require('../models/users');

router.get('/', authenticate, function(req, res, next) {
	var readytopay = readytogroup = readytoreceive = 0;
	var open_id = req.user.openid;
	var consumer = {};
	users.findOne({openId:open_id})
	.then((user) => {
		consumer = user;
		return orders.count({consumer:consumer._id, status:0});		
	}, (err) => next(err))
	.then((count) => {
		readytopay = count;
		return orders.count({consumer:consumer._id, status:1});
	}, (err) => next(err))
	.then((count) => {
		readytogroup = count;
		return orders.count({consumer:consumer._id, status:2});
	}, (err) => next(err))
	.then((count) => {
		readytoreceive = count;
		return res.send({status:1, readytopay:readytopay, readytogroup:readytogroup, readytoreceive:readytoreceive});
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = router;
