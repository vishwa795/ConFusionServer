const express = require("express");
const bodyparser = require("body-parser");
const Promotions = require("../models/promotions");
const promoRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

promoRouter.route("/")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Promotions.find({})
    .then(promos =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promos);
    }, err=> next(err))
    .catch(err => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.create(req.body)
    .then(promos =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promos);
    }, err => next(err))
    .catch(err => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT Operation is not permitted!");
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.remove({})
    .then(promos =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promos);
    }, err => next(err))
    .catch(err => next(err))
})

promoRouter.route("/:promoId")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then(promo =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(promo);
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end("POST operation not supported for /promotions/"+req.params.promoId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
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
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then( resp =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = promoRouter;