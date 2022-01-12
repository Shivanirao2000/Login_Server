const express = require("express");
// const fs = require("fs");
const http = require("http");
// const https = require("https");

// var privateKey = fs.readFileSync("./certificate/key.pem", "utf8");
// var certificate = fs.readFileSync("./certificate/cert.pem", "utf8");

// const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Router imports
const authRouter = require("./routes/auth");


// Use
app.use("/auth", authRouter);


app.get("/", (req, res) => {
  res.status(200).send(`Hello`);
});

app.get("*", (req, res) => {
  res
    .status(404)
    .send(
      `<h1>ERROR! Page Not Found!</h1><p>Please read docs for reference</p>`
    );
});


// var httpsServer = https.createServer(credentials, app);

app.listen(3000, () => {
  console.log("Running on port 3000...");
});

// httpsServer.listen(process.env.PORT || 443, () => {
//   console.log("Running on port 443...");
// });
