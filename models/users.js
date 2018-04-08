const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	openId: {
		type: String,
		required: true,
		unique: true
	},
	nickName: {
		type: String,
		required: true,
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
	mobilephone: {
		type: String,
		default: ''
	},
	address: {
		type: String,
		default: ''
	},
}, {
	timestamps: true
});

var users = mongoose.model('users', userSchema)

module.exports = users;

