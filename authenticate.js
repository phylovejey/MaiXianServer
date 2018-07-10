var redis = require('./global/redis');
var commonfunc = require('./global/commonfunc');
var mxlog = require('./global/maixianlog');

module.exports = function(req, res, next) {
	var sessionid = req.headers.sessionid;
	if(sessionid != null) {
		redis.getsession(sessionid, function(err, user) {
			if(err) {
        		mxlog.getLogger('log_date').info('服务器登录错误 ', sessionid);
				res.send({status:0, error:{error_code:10000, error_des:"服务器登录错误"}});
			}
			else {
				if(user != null) {
					/*if(commonfunc.createTimeStamp() > user.expiredtime) {
						redis.removesession(sessionid);
        				mxlog.getLogger('log_date').info('sessionid已过期 ', sessionid);
						res.send({status:0, error:{error_code:999, error_des:"sessionid已过期,请重新登录"}});
					}*/
					//else {
					req.user = user;
					return next();
					//}
				}
				else {
        			mxlog.getLogger('log_date').info('无效的sessionid ', sessionid);
					res.send({status:0, error:{error_code:997, error_des:"无效的sessionid"}});
				}
			}
		});
	}
	else {
        mxlog.getLogger('log_date').info('sessionid不能为空 ', sessionid);
		res.send({status:0, error:{error_code:998, error_des:"sessionid不能为空"}});
	}
}