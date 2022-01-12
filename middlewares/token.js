const jwt = require("jsonwebtoken");
const responsemodel = require("../models/response");
const SECRET = "SECRETKEY";

middlewareobj = {};

middlewareobj.validation = (req, res, next) => {
  try {
    jwt.verify(req.headers.authorization, SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res
          .status(401)
          .send(responsemodel.model1("Internal server error: " + err, "NOT AUTHENTICATED"));
      } else {
        req.tokenpayload = decoded;
        next();
      } 
    });
  } catch (err) {
    res
      .status(500)
      .send(responsemodel.model1("Internal server error: " + err, "NOT AUTHENTICATED"));
  }
};

module.exports = middlewareobj;
