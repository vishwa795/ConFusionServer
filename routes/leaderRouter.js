const express = require("express");
const bodyparser = require("body-parser");
const Leaders = require("../models/leaders");
const leaderRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

leaderRouter.route("/")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Leaders.find(req.query)
    .then(leaders =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(leaders);
    }, err=> next(err))
    .catch(err => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Leaders.create(req.body)
    .then(leaders =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(leaders);
    }, err => next(err))
    .catch(err => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT Operation is not permitted!");
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Leaders.remove({})
    .then(leaders =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(leaders);
    }, err => next(err))
    .catch(err => next(err))
})

leaderRouter.route("/:leaderId")
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then(leader =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(leader);
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("POST operation not supported for /Leaders/"+req.params.leaderId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    },{
        new:true
    })
    .then(leader =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(leader);
    }, err=> next(err))
    .catch(err => next(err))
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then( resp =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = leaderRouter;