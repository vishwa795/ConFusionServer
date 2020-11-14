const express = require("express");
const bodyparser = require("body-parser");

const dishRouter = express.Router();

dishRouter.route("/")
.all((req, res, next)=> {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next();
})
.get((req,res,next)=>{
    res.end("Sending details of all the dishes!");
})
.post((req,res,next)=>{
    res.end("Adding dish with name "+req.body.name+" & description - "+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("Operation is not permitted!");
})
.delete((req,res,next)=>{
    res.end("deleted all the dishes!");
})

dishRouter.route("/:dishId")
.all((req, res, next)=> {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next();
})
.get((req,res,next)=>{
    res.end("Sending details of all the dishes with ID: "+req.params.dishId);
})
.post((req,res,next)=>{
    res.end("POST operation not supported for /dishes/"+req.params.dishId);
})
.put((req,res,next)=>{
    res.write("Updating the dish with ID: "+req.params.dishId+"\n");
    res.end("Dish updated to dish name: "+req.body.name+" and description: "+req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleted dish with ID: "+req.params.dishId);
})

module.exports = dishRouter;