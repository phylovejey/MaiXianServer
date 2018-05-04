var express = require('express');
var router = express.Router();
var commonfunc = require('../global/commonfunc');
var wxpay = require('../pay/wxpay');
var authenticate = require('../authenticate');
var xmlparser = require('express-xml-bodyparser');
var mxlog = require('../global/maixianlog');

var orders = require('../models/orders');
var itemlists = require('../models/itemlists');
var users = require('../models/users');
var agents = require('../models/agents');

function computeexpressfee(item, quanity, takemode) {
	if(takemode == 0) {
		return 5 * 100;
	}
	else {
		return 0;
	}
}

function computetotalfee(item, quanity, purchasemode) {
	if(purchasemode == 0) {
		return item.agentprice * quanity * 100;
	}
	else if(purchasemode == 1) {
		return item.normalprice * quanity * 100;
	}
}

function createOrder(_userobjectid, _itemid, _itemquanity, _purchasemode, _total_fee, _express_fee, _order_no, 
					_address, _takemode, _agent_id, order_timestamp, nonceStr, prepay_id, paySign, _comment) {
	var order = {
		consumer: _userobjectid, 
		purchaseitem: _itemid,
		itemquanity: _itemquanity,
		purchasemode: _purchasemode,
		total_fee: _total_fee,
		express_fee: _express_fee,
		comment: _comment,
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
	var express_fee = req.body.express_fee;

	users.findOne({openId:open_id})
	.then((user) => {
		consumer = user;
		return itemlists.findById(req.body.itemid);
	}, (err) => next(err))
	.then((item) => {
		purchaseitem = item;
		total_fee = computetotalfee(item, req.body.quanity, req.body.purchasemode);
		express_fee = computeexpressfee(item, req.body.quanity, req.body.takemode);
		return wxpay.order(open_id, open_id, trade_no, express_fee + total_fee, user_ip);
	}, (err) => next(err))
	.then((args) => {
		payinfo = args;
		if(consumer != null && purchaseitem != null && payinfo != null) {
			orderobject = createOrder(consumer._id, purchaseitem._id, req.body.quanity, req.body.purchasemode, total_fee, express_fee, trade_no, 
						req.body.address, req.body.takemode, req.body.agent_id, payinfo.timeStamp, payinfo.nonceStr, payinfo.package, payinfo.paySign, req.body.comment);
			return orders.create(orderobject);
		}
		else {
			next(new Error("创建订单失败！"));
		}
	}, (err) => {
        mxlog.getLogger('log_date').info('wxpay failed ', order);
		next(err);})
	.then((order) => {
        mxlog.getLogger('log_date').info('create order SUCCESS ', order);
		res.send({status:1, payinfo:payinfo});
	}, (err) => next(err))
	.catch((err) => next(err));
});

/* 用户获取订单信息 */
router.get('/:statusid', authenticate, function(req, res, next) {
	var statusid = parseInt(req.params.statusid, 10);
	var open_id = req.user.openid;//"otek55C4yYD0hfqTqv_cWx2su7z4"

	users.findOne({openId:open_id})
	.then((user) => {
		return orders.find({consumer:user._id, status:statusid}).populate('consumer').populate('purchaseitem');
	}, (err) => next(err))
	.then((orders) => {
		return res.send({status:1, orders:orders});
	}, (err) => next(err))
	.catch((err) => next(err));
});

/* 支付回调通知 */
router.post('/notify', xmlparser({trim: false, explicitArray: false}), function(req, res, next) {
	if(req.body.xml.return_code == "SUCCESS"){
		var groupnum = 0;
		orders.findOne({order_no:req.body.xml.out_trade_no, nonceStr:req.body.xml.nonce_str})
		.then((order) => {
        	mxlog.getLogger('log_date').info('支付成功 ', order);
			if(!order.pay) {
				if(order.purchasemode == 0) {
					return orders.findByIdAndUpdate(order._id, {$set: {pay:true, status:1}}, {new: true, overwrite: false}).populate('purchaseitem');
				}
				else if(order.purchasemode == 1) {
					return orders.findByIdAndUpdate(order._id, {$set: {pay:true, status:2}}, {new: true, overwrite: false});
				}
			}
			return 1;
		}, (err) => {next(err)})
  		.then((order) => {
  			if(order == 1 || order.purchasemode == 1) {
  				return 1;
  			}
  			else {
        		mxlog.getLogger('log_date').info('后台修改支付状态成功 ', order);
				groupnum = order.purchaseitem.groupnum;
 				return orders.find({status: 1, purchaseitem:order.purchaseitem._id});
  			}
  		}, (err) => next(err))
  		.then((orders) => {
  			if(orders == 1 || orders.length < groupnum) {
  				return 1;
  			}
  			else
  			{
  				orders.forEach((order) => {
  					order.set({status: 2});
  				});
  				return orders.save();
  			}
  		}, (err) => next(err))
  		.then((results) => {
  			return res.send({return_code: "SUCCESS", return_msg: "OK"});
  		}, (err) => next(err))
  		.catch((err) => next(err))
	}
	else{
		res.send({return_code: "FAIL", return_msg: "FAIL"});
	}
});

module.exports = router;
