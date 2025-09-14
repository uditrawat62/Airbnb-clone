const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const commentschema= new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
    },
comment:String
})
 const review= mongoose.model("review",commentschema);
 module.exports=review;
