const express = require("express");
const bodyparser = require("body-parser");
const multer = require("multer");
const authenticate = require("../authenticate");

const storage  = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null,'public/images');
    },
    filename: (req, file, cb) =>{
        cb(null,file.originalname);
    }
});

const imageFileFilter = (req, file, cb) =>{
    if(!file.originalname.match(/\.(jpeg|jpg|png|gif)$/)){
        return cb(new Error("Invalid format for file upload"), false);
    }
    cb(null,true);
}

const upload = multer({
    storage:storage,
    fileFilter:imageFileFilter
});

const uploadRouter = express.Router();

uploadRouter.route("/")
.get(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end("GET Operation is not permitted!");
})
.post(authenticate.verifyUser,authenticate.verifyAdmin, upload.single("imageFile") ,(req,res)=>{
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.json(req.file);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT Operation is not permitted!");
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end("Delete Operation is not permitted!");
})

module.exports = uploadRouter;
