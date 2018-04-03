var express = require('express');
var router = express.Router();
var commonfunc = require('../global/commonfunc');
var wxpay = require('../pay/wxpay');

var orders = require('../models/orders');
var itemlists = require('../models/itemlists');
var agents = require('../models/agents');

/* 用户下单 */
router.post('/', function(req, res, next) {
	var trade_no = "1234567111";//commonfunc.createTradeNo();
	var open_id = "otek55KU4BiuY9S5OaG_40XTLvP8";//res.locals.user_openid
	var user_ip = "119.27.163.117";

	var validagent = false;
	var agent_id = '';
	var total_fee = req.body.total_fee;

	agents.findById(req.body.agent)
	.then((agent) => {
		if(agent != null) {
			validagent = true;
			agent_id = agent._id;
		}
		return itemlists.where('_id').in(req.body.items).exec();
	}, (err) => {
		return itemlists.where('_id').in(req.body.items).exec();
	})
	.then((items) => {
		var fee = 0;
		for (var i = items.length - 1; i >= 0; i--) {
			if(validagent) {
				fee = fee + items[i].agentprice;
			}
			else {
				fee = fee + items[i].normalprice;
			}
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
