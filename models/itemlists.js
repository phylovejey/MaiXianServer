const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const itemSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	briefDes: {
		type: String,
		required: true
	},
	bannerImage: {
		type: String,
		default: ''
	},
	overviewImage: {
		type: String,
		required: true
	},
	category: {
		type: Number,
		required: true
	},
	sales:{
		type: Number,
		default: 0
	},
	rating:{
		type: Number,
		min: 1,
		max: 5,
		default: 5
	},
	normalprice: {
		type: Number,
		min: 0,
		required: true
	},
	agentprice: {
		type: Number,
		min: 0,
		required: true
	},
	innerImage: [{
		type: String,
		required: true
	}],
	itemDetailImage: [{
		type: String,
		required: true
	}],
}, {
	timestamps: true
});

var itemlists = mongoose.model('itemlists', itemSchema)

module.exports = itemlists;

