var express = require('express');
var router = express.Router();
var request = require('request');
var wxconfig = require('../global/serverconfig').wxconfig;
var commonfunc = require('../global/commonfunc');

//"https://api.weixin.qq.com/sns/jscode2session?appid=$%s&secret=$%s&js_code=$%s&grant_type=authorization_code";
router.post('/', function(req, res, next){
    var mxres = res;
    var code = req.body.code;

    console.log("phy wxlogin code", code);

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
        if(res.statusCode == 200){
            console.log("phy wxdata ", data);
            if(data.openid != null){
                var token = commonfunc.createSessionId();
                mxres.send({status:1, sessionid:token});
            }
            else{
                mxres.send({status:0, error:data});
            }
        }
        else{
            console.log("phy authorization_code error ", err);
            next(err);
        }

    });
});

module.exports = router;