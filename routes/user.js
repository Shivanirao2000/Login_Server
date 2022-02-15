const express = require("express");
const db = require("../models/database");
const queries = require("../models/queries");
const responsemodel = require("../models/response");
const token = require("../middlewares/token");


const router = express.Router();



router.get("/getusers",(req,res)=>{


  db.query(queries.auth.getusers,(err,rows)=>
  {
    if(err){
      console.log(err)
      res
      .status(500)
      .send(responsemodel.model1("Internal Server Error: " + err, "ERROR"));
    }else{
      rows.rows.forEach((item)=>{
        item.password=undefined;
      })
      res
      .status(200)
      .send(responsemodel.model1(rows.rows, "Success"));
    }
  })


});

router.get("/getuser", token.validation, (req,res)=>{

  let employeeid = req.tokenpayload.employee_id;

  db.query(queries.auth.getuser, [employeeid],(err,rows)=>
  {
    if(err){
      console.log(err)
      res
      .status(500)
      .send(responsemodel.model1("Internal Server Error: " + err, "ERROR"));
    }else{
       rows.rows[0].password=undefined;
     
      res
      .status(200)
      .send(responsemodel.model1(rows.rows[0], "Success"));
    }
  })


});


module.exports = router;
