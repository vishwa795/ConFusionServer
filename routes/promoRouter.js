const express = require("express");
const bodyparser = require("body-parser");
const Promotions = require("../models/promotions");
const promoRouter = express.Router();
const authenticate = require("../authenticate");

promoRouter.route("/")
.get((req,res,next)=>{
    Promotions.find({})
    .then(promos =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promos);
    }, err=> next(err))
    .catch(err => next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Promotions.create(req.body)
    .then(promos =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promos);
    }, err => next(err))
    .catch(err => next(err))
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT Operation is not permitted!");
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Promotions.remove({})
    .then(promos =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promos);
    }, err => next(err))
    .catch(err => next(err))
})

promoRouter.route("/:promoId")
.get((req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then(promo =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promo);
    })
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("POST operation not supported for /promotions/"+req.params.promoId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set: req.body
    },{
        new:true
    })
    .then(promo =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promo);
    }, err=> next(err))
    .catch(err => next(err))
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then( resp =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = promoRouter;