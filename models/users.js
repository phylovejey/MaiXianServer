const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
	receivername: {
		type: String,
		required: true,	
	},
	receivermobilephone: {
		type: String,
		required: true
	},
	receiveraddress: {
		type: String,
		required: true
	},
});

const userSchema = new Schema({
	openId: {
		type: String,
		required: true,
		unique: true
	},
	nickName: {
		type: String,
		default: "匿名用户",
	},
	gender: {
		type: Number,
		min: 0,
		max: 2,
		default: 0
	},
	city: {
		type: String,
		default: ''
	},
	province: {
		type: String,
		default: ''
	},
	country: {
		type: String,
		default: ''
	},
	avatarUrl: {
		type: String,
		default: 'https://www.ccyangche.com/images/usericon.png'
	},
	unionId: {
		type: String,
		default: ''
	},
	point: {
		type: Number,
		min: 0,
		default: 0
	},
	agent: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'agents'
	},
	coupons:[{
		type: String,
		default: ''
	}],
	addresses: [addressSchema],
}, {
	timestamps: true
});

var users = mongoose.model('users', userSchema)

module.exports = users;

