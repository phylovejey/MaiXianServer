var express = require('express');
var router = express.Router();

const banners = require('../models/banners');

router.get('/', function(req, res, next) {
    var start = req.query.start;
    var end = req.query.end;

    banners.find({status:0})
    .then((results) => {
        start = Math.max(0, start);
        end = Math.min(end, results.length);
      	console.log("phy ", results);
        res.send({status:1, end:end, lists:results.slice(start, end)});
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
