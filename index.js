const mongoose = require('mongoose');
const chat =require("../models/chat.js");
const init =require("./init.js");
const express=require("express");
const app=express();
const port=8000;
main().then(console.log("connection of mongoosh successfully")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');}

app.listen(port,()=>{
console.log("server working properly");

})
 const dbs=async()=>{
await chat.insertMany(init.data);
console.log("data was save successfully! ")
};
dbs();

