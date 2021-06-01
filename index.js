require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT;

const database = require('./database');
// API Routes impport
const userRoute = require('./routes/User');
const teamRoute = require('./routes/Team');

app.use(cors())
app.use("/api/user", userRoute);
app.use("/api/team", teamRoute);

app.listen(port, ()=>{
    console.log("Server running at port: ", port);
});