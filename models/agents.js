const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	sex: {
		type: Number,
		min: 0,
		max: 1,
		default: 0
	},
	phonenumber: {
		type: Number,
		required: true,
		unique: true
	},
	community: [{
		type: String,
		required: true
	}],
	level: {
		type: Number,
		min: 1,
		max: 5,
		default: 5
	},
}, {
	timestamps: true
});

var agents = mongoose.model('agents', agentSchema)

module.exports = agents;

