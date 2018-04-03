var express = require('express');
var router = express.Router();
var commonfunc = require('../global/commonfunc');
var wxpay = require('../pay/wxpay');
var orders = require('../modes/orders');

/* 用户下单 */
router.post('/', function(req, res, next) {
	wxpay.order("JSAPI pay test", "otek55KU4BiuY9S5OaG_40XTLvP8", "1234567", "1", "119.27.163.117")
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
