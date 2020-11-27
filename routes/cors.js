const cors = require("cors");
const express = require("express");
const app = express();

const whitelist = ["https://localhost:3443","http://localhost:3000","http://localhost:3001"];

var corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptions);