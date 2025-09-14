const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const userschema= new Schema({
    username:String,
   
    password:Number,
    phone:Number
    


  

})
 const user= mongoose.model("user",userschema);
 module.exports=user;
