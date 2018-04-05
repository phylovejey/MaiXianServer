var express = require('express');
var router = express.Router();
var commonfunc = require('../global/commonfunc');
var wxpay = require('../pay/wxpay');

var orders = require('../models/orders');
var itemlists = require('../models/itemlists');
var agents = require('../models/agents');

/* 用户下单 */
router.post('/', function(req, res, next) {
	var trade_no = commonfunc.createTradeNo();
	var open_id = "otek55C4yYD0hfqTqv_cWx2su7z4";//res.locals.user_openid
	var user_ip = "119.27.163.117";

	var total_fee = req.body.total_fee;

	itemlists.where('_id').in(req.body.items)
	.then((items) => {
		var fee = 0;
		for (var i = items.length - 1; i >= 0; i--) {
			fee = fee + items[i].normalprice;
		}
		total_fee = fee;
		console.log("phy total_fee ", total_fee);
		return wxpay.order("JSAPI pay test", open_id, trade_no, total_fee, user_ip);
	}, (err) => next(err))
	.then((args) => {
		console.log("phy SUCCESS ", args);
		res.send({status:1, payinfo:args});
	}, (err) => {
		console.log("phy failed ", err);
		next(err);})
	.catch((err) => next(err));
});

/* 用户获取订单信息 */
router.get('/', function(req, res, next) {
	res.send("send all orders to user");
});

/* 支付回调通知 */
router.post('/notify', function(req, res, next) {
	console.log("phy /notify ", req.body);

	if(req.body.return_code == "SUCCESS"){
		res.send({return_code: "SUCCESS", return_msg: "OK"});
	}
	else{
		res.send({return_code: "FAIL", return_msg: "FAIL"});
	}
});

module.exports = router;
