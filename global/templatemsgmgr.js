const wxconfig = require('./serverconfig').wxconfig;
const tempmsglist = require('./serverconfig').templatemsglist;

var mxlog = require('./maixianlog');
var request = require('request');

var templatemsgmgr = {};
templatemsgmgr.access_token = null;
templatemsgmgr.timer = null;

//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
templatemsgmgr.getaccesstoken = function(){
    request.get({
        uri: wxconfig.wxaccesstokenurl,
        json: true,
        qs:{
            grant_type: "client_credential",
            appid: wxconfig.mxappid,
            secret: wxconfig.mxsecret,        
        }
    }, (err, res, data) => {
        if(templatemsgmgr.timer != null) {
             clearInterval(templatemsgmgr.timer);
             templatemsgmgr.timer = null
        }

        if(data.errcode == null) {
            mxlog.getLogger('log_date').info('getaccesstoken success ', data);
            templatemsgmgr.access_token = data.access_token;
            templatemsgmgr.timer = setInterval(templatemsgmgr.getaccesstoken, (data.expires_in - 60) * 1000);
        }
        else {
            mxlog.getLogger('log_date').info('getaccesstoken error ', data.errmsg);
            templatemsgmgr.timer = setInterval(templatemsgmgr.getaccesstoken, 5 * 60 * 1000);
        }

    });
}

templatemsgmgr.sendtempmsg = function(openid, templateidindex, page, formid, values) {
    var data = {};
    for (var i = 0; i < values.length; i++) {
        if(values[i] != "") {
            data["keyword"+(i+1)] = {value:values[i]};
        }
    }
    
    request({
            url: wxconfig.wxsendtempmsgurl + "?access_token=" + templatemsgmgr.access_token,
            method: 'POST',
            json: true,
            body: {
                touser: openid,
                template_id: tempmsglist[templateidindex].id,
                page: page,
                form_id: formid,
                data: data,
            }
        }, (err, res, data) => {
        mxlog.getLogger('log_date').info('sendtempmsg result ', data);
    });
}

module.exports = templatemsgmgr;