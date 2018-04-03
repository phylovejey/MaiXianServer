const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const purchaseitem = new Schema({
	item_objectid: {
		type: String,
		required: true,
		unique: true		
	},
	item_name: {
		type: String,
		required: true	
	},
	item_briefdes: {
		type: String,
		default: ''	
	},
	item_price: {
		type: Currency,
		min: 0,
		required: true,		
	},
	item_quanity: {
		type: Number,
		min: 1,
		required: true,		
	},
});

const orderSchema = new Schema({
	consumer_objectid: {
		type: String,
		required: true,
		unique: true
	},
	consumer_openid: {
		type: String,
		required: true,
		unique: true
	},
	consumer_name: {
		type: String,
		required: true
	},
	consumer_headpic: {
		type: String,
		default: ''
	},
	total_fee: {
		type: Currency,
		min: 0,
		required: true
	},
	order_no: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	items: [purchaseitem],
}, {
	timestamps: true
});

var orders = mongoose.model('orders', orderSchema)

module.exports = orders;

