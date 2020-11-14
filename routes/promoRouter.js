const express = require("express");
const bodyparser = require("body-parser");

const promoRouter = express.Router();

promoRouter.route("/")
.all((req, res, next)=> {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next();
})
.get((req,res,next)=>{
    res.end("Sending details of all the promotions!");
})
.post((req,res,next)=>{
    res.end("Adding promotion with name "+req.body.name+" & description - "+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT Operation is not permitted!");
})
.delete((req,res,next)=>{
    res.end("deleted all the promotions!");
})

promoRouter.route("/:promoId")
.all((req, res, next)=> {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next();
})
.get((req,res,next)=>{
    res.end("Sending details of promotion with ID: "+req.params.promoId);
})
.post((req,res,next)=>{
    res.end("POST operation not supported for /promotions/"+req.params.promoId);
})
.put((req,res,next)=>{
    res.write("Updating the promotion with ID: "+req.params.promoId+"\n");
    res.end("Promotion updated to promo name: "+req.body.name+" and description: "+req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleted promotion with ID: "+req.params.promoId);
})

module.exports = promoRouter;