var express = require('express');
var router = express.Router();
var request = require('request');
var wxconfig = require('../global/serverconfig').wxconfig;
var commonfunc = require('../global/commonfunc');
var redis = require('../global/redis');
var WXBizDataCrypt = require('../global/WXBizDataCrypt');
var users = require('../models/users');

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
                        console.log("phy err ", err);
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

router.post('/register', function(req, res, next){
    var pc = new WXBizDataCrypt(wxconfig.mxappid, res.locals.user_sessionkey);
    var data = pc.decryptData(req.body.encryptedData , req.body.iv);
    
    users.findOneAndUpdate({openId:data.openId}, data, {new:true,upsert:true})
    .then((result) => {
        return res.send({status:1});
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;