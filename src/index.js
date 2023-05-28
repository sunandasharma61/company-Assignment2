const express=require("express");
const mongoose=require("mongoose")
const route =require("./routes/route.js")
const app=express();


app.use(express.json());

mongoose.connect("mongodb+srv://url-shortner:Sunanda06*_@cluster0.kcc7xh8.mongodb.net/Task-Manager")

.then(()=>console.log("MongoDB is connected"))
.catch((error)=>console.log(error));

app.use("/",route);

app.listen( 3000, function () {
    console.log("Express App Running on Port: 3000");
  });