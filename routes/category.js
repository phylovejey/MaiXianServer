var express = require('express');
var router = express.Router();

var itemlists = require('../models/itemlists');
const ctgries = require('../global/serverconfig').ctgries;

router.get('/:categoryid', function(req, res, next) {
    var start = req.query.start;
    var end = req.query.end;
    itemlists.find({category:req.params.categoryid}).sort("-sales")
    .then((items) => {
        start = Math.max(0, start);
        end = Math.min(end, items.length);
        res.send({status:1, end:end, lists:items.slice(start, end)});
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
