var express = require('express');
var router = express.Router();
var request = require('request');
var wxconfig = require('../global/serverconfig').wxconfig;
var commonfunc = require('../global/commonfunc');
var redis = require('../global/redis');
var WXBizDataCrypt = require('../global/WXBizDataCrypt');
var users = require('../models/users');
var authenticate = require('../authenticate');
var mxlog = require('../global/maixianlog');

//"https://api.weixin.qq.com/sns/jscode2session?appid=$%s&secret=$%s&js_code=$%s&grant_type=authorization_code";
router.post('/', function(req, res, next){
    var mxres = res;
    var code = req.body.code;

    request.get({
        uri: wxconfig.wxloginurl,
        json: true,
        qs:{
            grant_type: "authorization_code",
            appid: wxconfig.mxappid,
            secret: wxconfig.mxsecret,
            js_code: code           
        }
    }, (err, res, data) => {
        if(res.statusCode == 200) {
            if(data.openid != null) {
                var sessionid = commonfunc.createSessionId();
                data.expiredtime = commonfunc.createTimeStamp() + wxconfig.wxsessionidvalidtime;
                redis.setsession(sessionid, data, function(err) {
                    if(err) {
                        mxlog.getLogger('log_date').info('setsession error ', sessionid);
                        mxres.send({status:0, error:"服务器错误"});
                    }
                    else {
                        mxres.send({status:1, sessionid:sessionid});
                    }
                });
            }
            else {
                next(err);
            }
        }
        else {
            next(err);
        }

    });
});

router.post('/register', authenticate, function(req, res, next){
    var data = null;
    if(req.body.encryptedData) {
        var pc = new WXBizDataCrypt(wxconfig.mxappid, req.user.session_key);
        data = pc.decryptData(req.body.encryptedData, req.body.iv);
    }
    else {
        data = {openId:req.user.openid};
    }
    
    users.findOneAndUpdate({openId:data.openId}, {$set:data}, {new:true,upsert:true})
    .then((result) => {
        return res.send({status:1});
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;