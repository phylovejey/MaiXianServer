var express = require('express');
var router = express.Router();

var itemlists = require('../models/itemlists');
const ctgries = require('../global/serverconfig').ctgries;
const pagenum = require('../global/serverconfig').pagenum;

router.get('/:categoryid', function(req, res, next) {
    var pageid = req.query.pageid;

    itemlists.find({category:req.params.categoryid}).sort("-sales").skip(pageid * pagenum).limit(pagenum)
    .then((items) => {
		res.send({status:1, len:items.length, lists:items});
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
