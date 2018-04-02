var express = require('express');
var router = express.Router();
var commonfunc = require('../global/commonfunc');
var wxpay = require('../pay/wxpay');

/* 用户下单 */
router.post('/', function(req, res, next) {
	console.log("phy /order ", req.body);
	wxpay.order("JSAPI支付测试", "otek55KU4BiuY9S5OaG_40XTLvP8", "1234567", 1, "119.27.163.117");
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
