const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
	bannername: {
		type: String,
		required: true,
		unique: true
	},
	status: {
		type: Number,
		min: 0,
		max: 1,
		default: 0
	},
	bannerimage: {
		type: String,
		required: true,
	},
	itemid: {
		type: String,
		required: true,
		unique: true
	},
	itemname: {
		type: String,
		required: true,
		unique: true
	},
}, {
	timestamps: true
});

var banners = mongoose.model('banners', bannerSchema)

module.exports = banners;

