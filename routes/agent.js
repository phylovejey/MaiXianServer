var express = require('express');
var router = express.Router();

var agents = require('../models/agents');

router.post('/', function(req, res, next) {
	agents.create(req.body)
	.then((agent) => {
		res.send({status:1, agent:agent});
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = router;
