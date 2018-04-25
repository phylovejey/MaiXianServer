var express = require('express');
var router = express.Router();
var commonfunc = require('../global/commonfunc');
var wxpay = require('../pay/wxpay');
var authenticate = require('../authenticate');
var xmlparser = require('express-xml-bodyparser');

var orders = require('../models/orders');
var itemlists = require('../models/itemlists');
var users = require('../models/users');
var agents = require('../models/agents');

function computetotalfee(item, quanity, purchasemode) {
	if(purchasemode == 0) {
		return item.agentprice * quanity;
	}
	else if(purchasemode == 1) {
		return item.normalprice * quanity;
	}
}

function createOrder(_userobjectid, _itemid, _itemquanity, _purchasemode, _total_fee, _order_no, 
					_address, _takemode, _agent_id, order_timestamp, nonceStr, prepay_id, paySign) {
	var order = {
		consumer: _userobjectid, 
		purchaseitem: _itemid,
		itemquanity: _itemquanity,
		purchasemode: _purchasemode,
		total_fee: _total_fee,
		order_no: _order_no,
		address: _address,
		takemode: _takemode,
		agent_id: _agent_id,
		order_timestamp:order_timestamp,
		nonceStr:nonceStr,
		package:prepay_id,
		paySign:paySign,
	}

	return order;
}

/* 用户下单 */
router.post('/', authenticate, function(req, res, next) {
	var trade_no = commonfunc.createTradeNo();
	var open_id = req.user.openid;
	var user_ip = "119.27.163.117";

	var consumer = null;
	var purchaseitem = null;
	var payinfo = null;
	var orderobject = null;
	var total_fee = req.body.total_fee;

	users.findOne({openId:open_id})
	.then((user) => {
		consumer = user;
		return itemlists.findById(req.body.itemid);
	}, (err) => next(err))
	.then((item) => {
		purchaseitem = item;
		total_fee = computetotalfee(item, req.body.quanity, req.body.purchasemode);
		return wxpay.order(open_id, open_id, trade_no, total_fee, user_ip);
	}, (err) => next(err))
	.then((args) => {
		payinfo = args;
		if(consumer != null && purchaseitem != null && payinfo != null) {
			orderobject = createOrder(consumer._id, purchaseitem._id, req.body.quanity, req.body.purchasemode, total_fee, trade_no, 
						req.body.address, req.body.takemode, req.body.agent_id, payinfo.timeStamp, payinfo.nonceStr, payinfo.package, payinfo.paySign);
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
router.get('/:status', authenticate, function(req, res, next) {
	var open_id = req.user.openid;//"otek55C4yYD0hfqTqv_cWx2su7z4"
	orders.find({consumer_openid:open_id, status:req.params.status})
	.populate('consumer')
	.populate('purchaseitem')
	.then((orders) => {
		return res.send({status:1, orders:orders});
	}, (err) => next(err))
	.catch((err) => next(err));
});

/* 支付回调通知 */
router.post('/notify', xmlparser({trim: false, explicitArray: false}), function(req, res, next) {
	if(req.body.xml.return_code == "SUCCESS"){
		orders.findOne({consumer_openid:req.body.xml.openid, order_no:req.body.xml.out_trade_no, 
						nonceStr:req.body.xml.nonce_str, paySign:req.body.xml.sign})
		.populate('consumer')
		.populate('purchaseitem')
		.then((order) => {
			if(!order.pay) {
				order.set({pay:true, status:1});
				return order.save();
			}
		}, (err) => next(err))
  		.then((order) => {
			return res.send({return_code: "SUCCESS", return_msg: "OK"});
  		}, (err) => next(err))
  		.catch((err) => next(err))
	}
	else{
		res.send({return_code: "FAIL", return_msg: "FAIL"});
	}
});

module.exports = router;
