var express = require('express');
var router = express.Router();

var users = require('../models/users');
var authenticate = require('../authenticate');

router.get('/', authenticate, function(req, res, next){
    users.findOne({openId:req.user.openid})
    .then((user) => {
        return res.send({status:1, addresses:user.addresses});
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/', authenticate, function(req, res, next){
    var address = req.body.address;
    users.findOne({openId:req.user.openid})
    .then((user) => {
        user.addresses.push(address);
        return user.save();
    }, (err) => next(err))
    .then((user) => {
        return res.send({status:1});
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.put('/:addressid', authenticate, function(req, res, next){
    users.findOne({openId:req.user.openid})
    .then((user) => {
        return user.addresses.findByIdAndUpdate(req.params.addressid, {$set: req.body}, {new: true});
    }, (err) => next(err))
    .then((address) => {
        return res.send({status:1});
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.delete('/:addressid', authenticate, function(req, res, next){
    users.findOne({openId:req.user.openid})
    .then((user) => {
        return user.addresses.findByIdAndRemove(req.params.addressid);
    }, (err) => next(err))
    .then((address) => {
        return res.send({status:1});
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;