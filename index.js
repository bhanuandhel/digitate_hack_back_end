require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT;

app.use(cors())

app.get("/", (req, res)=>{
    return res.status(200).json({status:true, message:"Default API Route"});
})

app.listen(port, ()=>{
    console.log("Server running at port: ", port);
});