var commonfunc = {
    // 随机字符串产生函数
    createNonceStr: function() {
        return Math.random().toString(36).substr(2, 15);
    },

    // 时间戳产生函数
    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + '';
    },

    createTradeNo:function() {
    	return 
    }
}

module.exports = commonfunc;