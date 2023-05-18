const express = require("express");
//here require means i want to include express in my project
const app = express();
// here i am using express libray. To use it, it is very important make A FUCNTION of it
const port = process.env.port || 8024;
//to covert the data in JSON format
const bodyParser = require("body-parser");
// getting-started.js
const mongoose = require("mongoose");
//to connect backend with frontend
const cors = require("cors");
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://rmnkaul979697:UfjY8wnMvFvUXmcI@cluster0.ml41ypu.mongodb.net/MovieTicketDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  console.log("Mongo DB connected");
}

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//to connect frontend with express server
app.use(cors());

const authenticationRoute = require("./routes/authentication-route");
app.use("/auth", authenticationRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Raman's Coding environment");
});

app.listen(port, () => {
  console.log("Node server is Connected on Port:", port);
});
