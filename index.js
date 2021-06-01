require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT;

const database = require('./database');
// API Routes impport
const userRoute = require('./routes/User');

app.use(cors())
app.use("/api/user", userRoute);

app.listen(port, ()=>{
    console.log("Server running at port: ", port);
});