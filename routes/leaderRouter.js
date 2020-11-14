const express = require("express");
const bodyparser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.route("/")
.all((req, res, next)=> {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next();
})
.get((req,res,next)=>{
    res.end("Sending details of all the leaders!");
})
.post((req,res,next)=>{
    res.end("Adding leader with name "+req.body.name+" & description - "+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT Operation is not permitted!");
})
.delete((req,res,next)=>{
    res.end("deleted all the leaders!");
})

leaderRouter.route("/:leaderId")
.all((req, res, next)=> {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next();
})
.get((req,res,next)=>{
    res.end("Sending details of leader with ID: "+req.params.leaderId);
})
.post((req,res,next)=>{
    res.end("POST operation not supported for /leaders/"+req.params.leaderId);
})
.put((req,res,next)=>{
    res.write("Updating the leader with ID: "+req.params.leaderId+"\n");
    res.end("leader updated to leader name: "+req.body.name+" and description: "+req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleted leader with ID: "+req.params.leaderId);
})

module.exports = leaderRouter;