var express = require('express');
var router = express.Router();

const banners = require('../models/banners');

router.get('/', function(req, res, next) {
    banners.find({status:0})
    .then((results) => {
        res.send({status:1, len:items.length, lists:results});
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
