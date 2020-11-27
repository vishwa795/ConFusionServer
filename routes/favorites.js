const express = require("express");
const Favorite = require("../models/favorites");
const bodyparser = require('body-parser');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require("./cors");

favoriteRouter.route("/")
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorite.findOne({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then( favorite => {
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(favorite);
    }, err => next(err))
    .catch(err => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Favorite.findOne({user:req.user._id})
    .then(favorite =>{
        if(favorite!== null){
            console.log(favorite);
            for(var i=0; i<req.body.length; i++ ){
                if(favorite.dishes.indexOf(req.body[i]._id) === -1){
                    favorite.dishes.push(req.body[i]._id);
                }
            }
        }
        else{
            var fav = new Favorite({user:req.user._id});
            for(var i=0;i<req.body.length;i++){
                fav.dishes.push(req.body[i]._id);
            }
            fav.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(favorite);
            }, err => next(err))
            .catch(err => next(err))
        }
    }, err=> next(err))
    .catch(err =>next(err))

})
.put(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT operation not allowed!");
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Favorite.remove({user:req.user._id})
    .then(favorite =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(favorite);
    }, err => next(err))
    .catch(err => next(err))
})

favoriteRouter.route("/:dishId")
.get(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end("GET operation not suported");
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Favorite.findOne({user:req.user._id})
    .then(favorite =>{
        if(favorite){
            if(favorite.dishes.indexOf(req.params.dishId) === -1){
                favorite.dishes.push(req.params.dishId);
            }
            favorite.save()
            .then(favorite =>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(favorite);
            }, err => next(err))
            .catch(err => next(err))
        }
        else{
            var favorite = new Favorite({user:req.user._id});
            favorite.dishes.push(req.params.dishId);
            favorite.save()
            .then(favorite =>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(favorite);
            }, err => next(err))
            .catch(err => next(err))
        }
    }, err => next(err))
    .catch(err => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req,res)=>{
    res.statusCode = 403;
    res.end("PUT operation not supported!");
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req,res,next)=>{
    Favorite.findOne({user: req.user._id})
    .then(favorite =>{
        console.log(favorite.dishes.length);
        for(var i=0;i<favorite.dishes.length;i++){
            if(favorite.dishes[i]._id == req.params.dishId){
                favorite.dishes.splice(i,1);
                console.log("fav after removing:",favorite.dishes);
            }
        }
        favorite.save()
        .then(favorite =>{
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.json(favorite);
        }, err => next(err))
        .catch(err => next(err))
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = favoriteRouter;