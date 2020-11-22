const express = require("express");
const bodyparser = require("body-parser");
const Dishes = require("../models/dishes");
const dishRouter = express.Router();
const authenticate = require("../authenticate");

dishRouter.use(bodyparser.json());

dishRouter.route("/")
.get((req,res,next)=>{
    Dishes.find({})
    .populate('comments.author')
    .then(dishes =>{
        console.log(dishes);
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(dishes);
    }, err=> next(err))
    .catch(err=> next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.create(req.body)
    .then(dish =>{
        console.log("Dish added",dish);
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(dish);
    }, err=> next(err))
    .catch(err => next(err))
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end("Operation is not permitted!");
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.remove({})
    .then(resp =>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    }, err=> next(err))
    .catch(err=> next(err))
})

dishRouter.route("/:dishId")
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then(dish=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(dish);
    }, err=> next(err))
    .catch(err=> next(err))
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.end("POST operation not supported for /dishes/"+req.params.dishId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId, {
         $set: req.body }, 
         {new:true})
         .then(dish =>{
             res.statusCode = 200;
             res.setHeader("Content-Type","application/json");
             res.json(dish);
         }, err=> next(err))
         .catch(err=> next(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(resp=>{
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(resp);
    }, err=> next(err))
    .catch(err => next(err))
})

dishRouter.route("/:dishId/comments")
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then(dish =>{
        if(dish!= null){
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.json(dish.comments);
        }
        else{
            var err = new Error("Dish "+req.params.dishId+" does not exist");
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch(err => next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish!= null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then(dish => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then(dish =>{
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                })
            }, err=> next(err))
            .catch(err=> next(err))
        }
        else{
            var err = new Error("Dish "+req.params.dishId+" does not exist");
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch(err => next(err) )
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("Operation is not permitted!");
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if(dish!= null){
            for(var i=0; i<dish.comments.length; i++){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then(dish =>{
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json(dish);
            }, err=> next(err))
            .catch(err => next(err))
        }
        else{
            var err = new Error("Dish "+req.params.dishId+" does not exist");
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch(err => next(err))
})

dishRouter.route("/:dishId/comments/:commentId")
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then(dish =>{
        if(dish != null && dish.comments.id(req.params.commentId)!=null){
            res.statusCode = 200;
            res.setHeader("Content-Type","application/json");
            res.json(dish.comments.id(req.params.commentId));
        }
        else if(dish == null){
            var err = new Error("Dish "+ req.params.dishId+" does not exist!");
            err.status = 404;
            next(err);
        }
        else{
            var err = new Error("Comment "+ req.params.commentId+" does not exist!");
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch(err=> next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("POST operation not supported!");
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish != null && dish.comments.id(req.params.commentId)!=null){
            if(!req.user.admin && req.user._id.equals(dish.comments.id(req.params.commentId).author)){
                if(req.body.rating){
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save()
                .then( dish =>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then(dish =>{
                        res.statusCode = 200;
                        res.setHeader("Content-Type","application/json");
                        res.json(dish);
                    })
                }, err => next(err))
                .catch(err => next(err))
            }
            else{
                var err = new Error("You do not have authority to delete this comment");
                err.status = 403;
                next(err);
            }
        }
        else if(dish == null){
            var err = new Error("Dish "+ req.params.dishId+" does not exist!");
            err.status = 404;
            next(err);
        }
        else{
            var err = new Error("Comment "+ req.params.commentId+" does not exist!");
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch(err => next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        if(dish != null && dish.comments.id(req.params.commentId)!=null){
            if(!req.user.admin && req.user._id.equals(dish.comments.id(req.params.commentId).author)){
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then( dish =>{
                    console.log("dish after saving is ",dish);
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then(dish =>{
                        res.statusCode = 200;
                        res.setHeader("Content-Type","application/json");
                        res.json(dish);
                    })
                }, err => next(err))
                .catch(err => next(err))
            }
            else{
                var err = new Error("You do not have authority to delete this comment");
                err.status = 403;
                next(err);
            }
        }
        else if(dish == null){
            var err = new Error("Dish "+ req.params.dishId+" does not exist!");
            err.status = 404;
            next(err);
        }
        else{
            var err = new Error("Comment "+ req.params.commentId+" does not exist!");
            err.status = 404;
            next(err);
        }
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = dishRouter;