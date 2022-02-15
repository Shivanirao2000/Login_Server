const express = require("express");
const db = require("../models/database");
const queries = require("../models/queries");
const responsemodel = require("../models/response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const token = require("../middlewares/token");
const { application } = require("express");

const SECRET = "SECRETKEY";

const router = express.Router();

router.post("/signin", (req, res) => {
  db.query(
    queries.auth.signincheck(req.body.username),
    async (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send(responsemodel.model1("Internal server error: " + err, "ERROR"));
      } else if (!result.rows.length) {
        console.log(result)
        res
          .status(401)
          .send(
            responsemodel.model1(
              "No User Found with that username",
              "UNAUTHORIZED"
            )
          );
      } else if (
        !(await bcrypt.compare(req.body.password, result.rows[0].password))
      ) {
        res
          .status(401)
          .send(
            responsemodel.model1(
              "Username or password is incorrect",
              "UNAUTHORIZED"
            )
          );
      } else {
        const token = jwt.sign(
          {
            employee_id: result.rows[0].employeeid,
            role: result.rows[0].designation,
            department: result.rows[0].department,
          },
          SECRET
        );
        
        db.query(
          
          queries.auth.signinupdate,
          [
            result.rows[0].employeeid,
            req.body.osname,
            req.body.osversion,
            req.body.token,
            req.body.mobilemodel,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              res
                .status(500)
                .send(
                  responsemodel.model1("Internal Server Error: " + err, "ERROR")
                );
            } else {
              res.status(200).send(responsemodel.model1(token, "SUCCESS"));
            }
          }
        );
        // res.status(200).send(responsemodel.model1(token, "SUCCESS"));
      }
    }
  );
});

router.post("/passwordchange", token.validation, (req, res) => {
  let employeeid = req.tokenpayload.employeeid;
  db.query(
    queries.auth.passwordchangecheck,
    [employeeid],
    async (err, rows) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send(responsemodel.model1("Internal server error: " + err, "ERROR"));
      } else if (rows.length) {
        try {
          const hashed = await bcrypt.hash(req.body.password, 10);
          db.query(
            queries.auth.passwordupdate,
            [hashed, employeeid],
            (err, results, fields) => {
              if (err) {
                console.log(err);
                res
                  .status(500)
                  .send(
                    responsemodel.model1(
                      "Internal Server Error: " + err,
                      "ERROR"
                    )
                  );
              } else {
                res.status(200).send(responsemodel.model1("", "SUCCESS"));
              }
            }
          );
        } catch {
          console.log(err);
          res
            .status(500)
            .send(
              responsemodel.model1("Internal Server Error: " + err, "ERROR")
            );
        }
      } else {
        res
          .status(401)
          .send(responsemodel.model1("User doesnot exist", "FAILURE"));
      }
    }
  );
});

router.post("/signup", (req, res) => {
  db.query(queries.auth.signupcheck(req.body.username), async (err, rows) => {

    console.log("signup check",req.body.username)
    if (err) {
      console.log(err)
      res
        .status(500)
        .send(responsemodel.model1("Internal server error: " + err, "ERROR"))
    } else if (!rows.length) {
      try {
        const hashed = await bcrypt.hash(req.body.password, 10);

        db.query(
          queries.auth.signupinsert(
            req.body.username,
            req.body.employeeid,
            hashed,
            req.body.mobilenumber,
            req.body.email,
          ),
          (err, results, fields) => {
            console.log("this")
            if (err) {
              console.log(err);
              res
                .status(500)
                .send(
                  responsemodel.model1("Internal Server Error: " + err, "ERROR")
                );
            } else {
              res.status(200).send(responsemodel.model1("", "SUCCESS"));
            }
          }
        );
      } catch {
        console.log(err);
        console.log("that")

        res
          .status(500)
          .send(responsemodel.model1("Internal Server Error: " + err, "ERROR"));
      }
    } else {
      res
        .status(401)
        .send(responsemodel.model1("User with credentials exist", "FAILURE"));
    }
  });
});




module.exports = router;
