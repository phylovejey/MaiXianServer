var express = require('express');
var router = express.Router();
var commonfunc = require('../global/commonfunc');
var wxpay = require('../pay/wxpay');

var orders = require('../models/orders');
var itemlists = require('../models/itemlists');
var users = require('../models/users');
var agents = require('../models/agents');

function createOrder(_userobjectid, _openid, _name, _avartarurl, total_fee, order_no, address, agent_id, pay, items, item_quanitys) {
	var order = {
		consumer_objectid: _userobjectid, 
		consumer_openid: _openid,
		consumer_name: _name,
		consumer_headpic: _avartarurl,
		total_fee: total_fee,
		order_no: order_no,
		address: address,
		agent_id: agent_id,
		pay: pay,
		items: [],
	}

	for (var i = items.length - 1; i >= 0; i--) {
		var item = {
			item_objectid: items[i]._id,
			item_name: items[i].name,
			item_briefdes: items[i].briefDes,
			item_price: items[i].normalprice,
			item_quanity: item_quanitys[items[i]._id],
		}
		order.items.push(item);
	}

	return order;
}

/* 用户下单 */
router.post('/', function(req, res, next) {
	var trade_no = commonfunc.createTradeNo();
	var open_id = res.locals.user_openid;//"otek55C4yYD0hfqTqv_cWx2su7z4"
	var user_ip = "119.27.163.117";

	var consumer = null;
	var purchaseitems = null;
	var payinfo = null;
	var orderobject = null;
	var itemquanitys = {};
	var items = new Array();
	for (var i = req.body.items.length - 1; i >= 0; i--) {
		item_quanitys[req.body.items[i]._id] = req.body.items[i].quanity;
		items.push(req.body.items[i]._id);
	}
	var total_fee = req.body.total_fee;

	users.findOne({openId:open_id})
	.then((user) => consumer = user, (err) => next(err))
	itemlists.where('_id').in(items)
	.then((items) => {
		purchaseitems = items;

		var fee = 0;
		for (var i = items.length - 1; i >= 0; i--) {
			fee = fee + items[i].normalprice;
		}
		total_fee = fee;
		return wxpay.order(open_id, open_id, trade_no, total_fee, user_ip);
	}, (err) => next(err))
	.then((args) => {
		payinfo = args;
		if(consumer != null && purchaseitems != null && payinfo != null) {
			orderobject = createOrder(consumer._id, consumer.openId, consumer.nickName, consumer.avatarUrl, 
				total_fee, req.body.address, "", false, purchaseitems, itemquanitys);
			return orders.create(orderobject);
		}
		else {
			next(new Error("创建订单失败！"));
		}
	}, (err) => {
		console.log("phy failed ", err);
		next(err);})
	.then((order) => {
		console.log("create order SUCCESS ", order);
		res.send({status:1, payinfo:payinfo});
	}, (err) => next(err))
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
