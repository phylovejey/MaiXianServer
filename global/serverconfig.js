var config = {
	wxconfig: {
		wxloginurl: 'https://api.weixin.qq.com/sns/jscode2session',
		wxaccesstokenurl: 'https://api.weixin.qq.com/cgi-bin/token',
		wxsendtempmsgurl: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send',
		wxunipayurl: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
		wxpaynotifyurl: 'https://www.ccyangche.com/order/notify',
		wxsessionidvalidtime: 604800,
		mxappid: 'wxf40b8a310ac448ee',
		mxsecret: '857185500a63ee246163486da3ca6608',
		mxshopaccount: '1500973861',
		mxshopapikey: 'mxzxzylphyccyangche1234554321123',
	},

	dbconfig: {
		url: 'mongodb://mxphy:mxccyangche1234!@localhost:24404/maixiandb'
	},

	httpsconfig: {
		passworld: 'ccyangche1234!'
	},

	ctgries:["海鲜水产","肉禽蛋品","新鲜果蔬","特色农产"],

	pagenum: 8,

	templatemsglist:[{"id":"o6b2CdOWdlC5NlFIKzoNQWEIXwN5H6QzvRuFEGmHffE","title":"购买成功通知"},
					 {"id":"7kEB8tmI2iqXXT5abi6YZaKBXWwv3weJtz6B1CJbSsc","title":"拼团成功通知"}]
}

module.exports = config;
