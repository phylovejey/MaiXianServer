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

    timestampToDateStr: function(timestamp) {
        var date = new Date(timestamp);  
        var y = date.getFullYear();    
        var m = date.getMonth() + 1;    
        m = m < 10 ? ('0' + m) : m;    
        var d = date.getDate();    
        d = d < 10 ? ('0' + d) : d;    
        var h = date.getHours();  
        h = h < 10 ? ('0' + h) : h;  
        var minute = date.getMinutes();  
        var second = date.getSeconds();  
        minute = minute < 10 ? ('0' + minute) : minute;    
        second = second < 10 ? ('0' + second) : second;   
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    },

    createTradeNo: function() {        
    	return crypto.randomBytes(16).toString("hex");
    },

    createSessionId: function() {
        return uuidV1().toString();
    }
}

module.exports = commonfunc;