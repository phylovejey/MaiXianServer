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

const orderSchema = new Schema({
	consumer: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
	},
	purchaseitem: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'itemlists'
	},
	itemquanity: {
		type: Number,
		min: 1,
		required: true,		
	},
	purchasemode: {
		type: Number,
		default: 0
	},
	total_fee: {
		type: Number,
		min: 0,
		required: true
	},
	order_no: {
		type: String,
		required: true,
		unique: true
	},
	address: addressSchema,
	expresscompany: {
		type: String,
		default: ''
	},
	expressnumber: {
		type: String,
		default: ''
	},
	expressfee: {
		type: Number,
		default: 0
	},
	takemode: {
		type: Number,
		default: 0
	},
	takeplace: {
		type: String,
		default: '成都市高新区远大荷兰水街7号楼一楼(近华府大道地铁站c2口)'
	},
	comment: {
		type: String,
		default: ''
	},
	agent_id: {
		type: String,
		default: ''
	},
	pay: {
		type: Boolean,
		default: false
	},
	status: {
		type: Number,
		default: 0
	},
	order_timestamp: {
		type: Number,
		required: true
	},
	nonceStr: {
		type: String,
		required: true
	},
	package: {
		type: String,
		required: true
	},
	paySign: {
		type: String,
		required: true
	},
}, {
	timestamps: true
});

var orders = mongoose.model('orders', orderSchema)

module.exports = orders;

