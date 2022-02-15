const express = require("express");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Router imports
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");


// Use
app.use("/auth", authRouter);
app.use("/user", userRouter);



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



app.listen(3000, () => {
  console.log("Running on port 3000...");
});


