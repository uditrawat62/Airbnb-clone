const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let listing=[{
    title:{
        type:String
    },
    description:{
       type:String  
    },
  image:{
    
      type:String,
      default: "https://unsplash.com/photos/a-blue-flower-stands-in-a-wheat-field-O7meUgRrb6Y",
set:(v) =>v==="" ?"https://unsplash.com/photos/a-blue-flower-stands-in-a-wheat-field-O7meUgRrb6Y":v
  },
    price:Number,
    location:String,
    country:String,
    rating:[{
     type: Schema.Types.ObjectId,
      ref:"review"
    }]
}];
const schems= mongoose.Schema(listing);
const post = mongoose.model("post",schems);
module.exports=post;
