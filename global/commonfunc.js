var uuidV1 = require('uuid/v1');
var crypto = require('crypto');

var commonfunc = {
    // 随机字符串产生函数
    createNonceStr: function() {
        return Math.random().toString(36).substr(2, 15);
    },

    // 时间戳产生函数
    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000);
    },

    createTradeNo:function() {        
    	return crypto.randomBytes(16).toString("hex");
    },

    createSessionId:function() {
        return uuidV1().toString();
    }
}

module.exports = commonfunc;