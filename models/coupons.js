const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
	scope: {//使用范围-1全场通用
		type: Number,
		default: -1
	},
	reachamout: {
		type: Number,
		default: 0,
	},
	discount: {
		type: Number,
		default: 0
	},
	name: {
		type: String,
		default: '优惠券'
	},
	briefdes: {
		type: String,
		default: ''
	},
}, {
	timestamps: true
});

var coupons = mongoose.model('coupons', couponSchema)

module.exports = coupons;

