const wxconfig = require('../global/serverconfig').wxconfig;
const commonfunc = require('../global/commonfunc');
var request = require("request");
var crypto = require('crypto');
var Q = require('q');

var wxpay = {
    getXMLNodeValue: function(node_name, xml) {
        var tmp = xml.split("<" + node_name + ">");
        var _tmp = tmp[1].split("</" + node_name + ">");
        return _tmp[0];
    },

    raw: function(args) {
        var keys = Object.keys(args);
        keys = keys.sort()
        var newArgs = {};
        keys.forEach(function(key) {
            newArgs[key] = args[key];
        });
        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);
        return string;
    },

    paysignjs: function(appid, nonceStr, package, signType, timeStamp) {
        var ret = {
            appId: appid,
            nonceStr: nonceStr,
            package: package,
            signType: signType,
            timeStamp: timeStamp
        };
        var string = this.raw(ret);
        string = string + '&key=' + wxconfig.mxshopapikey;
        var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    },

    paysignjsapi: function(appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
        var ret = {
            appid: appid,
            body: body,
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url: notify_url,
            openid: openid,
            out_trade_no: out_trade_no,
            spbill_create_ip: spbill_create_ip,
            total_fee: total_fee,
            trade_type: trade_type
        };
        var string = this.raw(ret);
        string = string + '&key=' + wxconfig.mxshopapikey; //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置
        var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    },

    // 此处的attach不能为空值 否则微信提示签名错误
    order: function(body, openid, trade_no, total_fee, user_ip) {
        var deferred = Q.defer();
        var nonce_str = commonfunc.createNonceStr();
        var timeStamp = commonfunc.createTimeStamp();
        var sign = this.paysignjsapi(wxconfig.mxappid, body, wxconfig.mxshopaccount, nonce_str, wxconfig.wxpaynotifyurl, openid, 
            trade_no, user_ip, total_fee, 'JSAPI');

        var formData = "<xml>";
        formData += "<appid>" + wxconfig.mxappid + "</appid>"; //appid
        formData += "<body>" + body + "</body>";
        formData += "<mch_id>" + wxconfig.mxshopaccount + "</mch_id>"; //商户号
        formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
        formData += "<notify_url>" + wxconfig.wxpaynotifyurl + "</notify_url>";
        formData += "<openid>" + openid + "</openid>";
        formData += "<out_trade_no>" + trade_no + "</out_trade_no>";
        formData += "<spbill_create_ip>" + user_ip + "</spbill_create_ip>";
        formData += "<total_fee>" + total_fee + "</total_fee>";
        formData += "<trade_type>JSAPI</trade_type>";
        formData += "<sign>" + sign + "</sign>";
        formData += "</xml>";

        var self = this;

        request({
            url: wxconfig.wxunipayurl,
            method: 'POST',
            body: formData
        }, function(err, response, body) {
            if (!err && response.statusCode == 200) {
                var return_code = self.getXMLNodeValue('return_code', body.toString("utf-8")).split('[')[2].split(']')[0];
                console.log("phy body ", body);
                
                if(return_code == "SUCCESS") {
                    var prepay_id = self.getXMLNodeValue('prepay_id', body.toString("utf-8")).split('[')[2].split(']')[0];
                    //签名
                    var _paySignjs = self.paysignjs(wxconfig.mxappid, nonce_str, 'prepay_id=' + prepay_id, 'MD5', timeStamp);
                    var args = {
                        appId: wxconfig.mxappid,
                        timeStamp: timeStamp,
                        nonceStr: nonce_str,
                        signType: "MD5",
                        package: prepay_id,
                        paySign: _paySignjs
                    };
                    deferred.resolve(args);
                }
                else {
                    deferred.reject(body);
                }
            } 
            else {
                deferred.reject(body);
            }
        });

        return deferred.promise;
    },
};

module.exports = wxpay;

