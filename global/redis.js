var redis = require("redis");
var mxlog = require('./maixianlog');

var globalredis = {
    redisclient: null,

    connettoredis: function(serverip, serverport) {
        this.redisclient = redis.createClient(serverport, serverip);
        this.redisclient.on('error', function(error) {
            mxlog.getLogger('console').info("RedisServer is error!\n" + error);
        });
        this.redisclient.on("connect", function() {
            mxlog.getLogger('console').info("RedisServer is connected!");
        });
        this.redisclient.on("end", function() {
            mxlog.getLogger('console').info("RedisServer is end!");
        });
    },

    //写入JavaScript(JSON)对象
    setsession: function(sessionid, value, callback) {
        if(this.redisclient != null) {
            this.redisclient.hmset(sessionid, value, function(err) {
                    callback(err);
            });
        }
        else {
            callback(new Error("Redis has not been initiated!!!"));
        }
    },

    //读取JavaScript(JSON)对象
    getsession: function(sessionid, callback) {
        if(this.redisclient != null) {
            this.redisclient.hgetall(sessionid, function(err, object) {
                callback(err, object);
            });
        }
        else {
            callback(new Error("Redis has not been initiated!!!"));
        }
    },

    removesession: function(sessionid, callback) {
        if(callback == null) {
            callback = function(err, response) {
                mxlog.getLogger('console').info("removesession response ", response);
            }
        }
        
        if(this.redisclient != null) {
            this.redisclient.del(sessionid, function(err, response) {
                callback(err, response);
            });
        }
        else {
            callback(new Error("Redis has not been initiated!!!"));
        }
    }
};

module.exports = globalredis;