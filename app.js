const express=require("express");
const app=express();
const port=8080;
const path=require("path")

const methodoverride=require('method-override');
app.use(methodoverride("_method"));
app.set("view engine","ejs");  
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,'public')));
const mongoose = require('mongoose');
const EJSengine = require('ejs-mate');
const methodOverride = require('method-override');

app.engine('ejs', EJSengine);

app.use(express.urlencoded({extended:true}));
main().then(console.log("connection of mongoosh successfully")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const chat=require("./models/chat.js");
//const init=require('./init/init.js')
const ratings=require("./models/review.js");
const user=require("./models/user.js");

const bcrypt = require("bcrypt");
const Session = require('express-session');
const cookie = require('cookie-parser');
const flash=require('connect-flash'); 
app.use(express.json())

app.use(Session({

  secret:"mysupersecret",
  
  resave:false,
  saveUninitialized:true,
  cookie:{
    expire:Date.now()+(7*24*60*60*1000),
    maxAge:7*24*60*60*1000

  }

}));
  app.use(flash()),

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
   res.locals.delete=req.flash("delete");
  next();
})

app.get("/",async(req,res)=>{
const allchat= await chat.find({});
res.render('index.ejs',{allchat});
});
//DELETE LIST
app.delete('/delete/:id',async(req,res)=>{
try{
  let{id}=req.params;

let data= await chat.findByIdAndDelete(id);
req.flash('delete',' list deleted sussesfully!');
res.redirect('/');
console.log(data);
} catch(err){
console.log("err occour in delete post code")
}

});



//update list
app.put('/update/:id', async(req,res)=>{
  let{title:newtitle,description:newdescription,price:newprice,location:newlocation,country:newcountry}=req.body;
    let{id}=req.params;
  let viewchat= await chat.findById(id);
 await chat.findByIdAndUpdate(id,{title:newtitle,description:newdescription,price:newprice,location:newlocation,country:newcountry});
  res.redirect('/');
  console.log("updated succesfully")
})
app.get('/newlist', async (req,res)=>{
   await console.log('working');

 res.render('form.ejs');
})
//new list
app.post('/new',(async(req,res, next)=>{
  
  let{title,description,image,location,price,country}=req.body;
let chat1=new chat({
  title:title,
  description:description,
  image:image,
  location:location,
  price:price,
  country:country,
 
});
chat1.save();
req.flash('success','new list added sussesfully!')
  res.redirect('/');
}))


app.get('/:id', async( req,res)=>{
     let{id}=req.params;
     console.log({id});
     const viewchats= await chat.findById(id).populate("rating");

   res.render('detail.ejs',{viewchats});
   
})
app.get('/edit/:id', async(req,res)=>{
  let{id}=req.params;
  let viewchat= await chat.findById(id);
  res.render('edit.ejs',{viewchat});

})
//review 
app.post('/:id/review',async(req,res)=>{
  let{id}=req.params;
  let{rating,comment}=req.body;
  let post= await chat.findById(id);
  let review1=new ratings({
    rating:rating,
    comment:comment
  });
  post.rating.push(review1);
  review1.save();
  post.save();
  res.redirect(`/${post._id}`);

})
//review delete
app.delete("/delete/:id/review/:reviewId",async(req,res)=>{
  try{
let{id,reviewId}=req.params;

 await ratings.findByIdAndDelete(reviewId);
 await chat.findByIdAndUpdate(id,{$pull :{rating:reviewId }});
res.redirect(`/${id}`);
  }
  catch(err){
    console.log("error occour in delete code")
  }
});
//login
app.get('/account/login',(req,res)=>{
  console.log('signin page')
  res.render('login.ejs');
})
app.get('/account/signin',(req,res)=>{
  console.log('signin page')
  res.render('signin.ejs');
})

app.get("/login/user",async(req,res)=>{

  let{username,password}=req.query;

  const check=await user.findOne({username});

  if(check && check.password==password){
    req.flash('success',`Welcome ${username}!`)
    res.redirect('/');
  }
  else{
    
res.send("wrong details")
  }

  
});
app.post('/signin/user',(req,res)=>{
  let{username,password,phone}=req.body;
     let user1=new user({  
  username:username,
  password:password,
  phone:phone,
})
let data=user1.save();
 req.flash('success','sigin successful')
 res.redirect('/')

})
app.get('/account/forgot',(req,res)=>{
  console.log('password forgot page')
  res.render('forgot.ejs');
})
app.use((req,res,next)=>{
  res.send("Somthing went wrong!");
})

app.listen(port,()=>{
console.log("server working properly");
})
