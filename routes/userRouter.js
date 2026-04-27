const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const userRouter = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');





userRouter.post('/signup',async(req, res)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        //encrypt the password before saving to database
        const hasedPassword = await bcrypt.hash(password, 10);
        console.log(hasedPassword);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hasedPassword
        })
        await user.save();
        res.status(201).json({user,message:"user Created successfully"});
    }catch (err) {
  console.error(err);

  res.status(500).json({
    message: err.message,
    stack: err.stack   //  only in dev, remove in production
  });
}
})

userRouter.post('/login',async(req, res)=>{
   try{
    const {email, password} = req.body;
    //is email valid or not


    //find the user by email
   const user=await  User.findOne({email})
   if(!user){
    throw new Error("credentials are not valid");
   }
   //compare the password
   const isPasswordValid = await bcrypt.compare(password,user.password);
   if(!isPasswordValid){
    throw new Error("credentials are not valid");
   }
   //generate thee token using jwt
   const token = await user.jwtToken(user._id);
   //setting the token on cookie
   res.cookie("token", token,{expires: new Date(Date.now() + 3600000)})
    res.status(200).json({message: "login successful"});



   }catch(err){
    res.status(500).json({message: err.message,
    stack: err.stack   }) //  only in dev, remove in production   
   }
})




//user update route
userRouter.patch('/update/:userid',async (req, res)=>{
 try{
   const {userid} = req.params;
  //find the user by id from database
  const user =await User.findById( userid);
  if(!user){
    throw new Error({message:"user not found"});
  }
  //update the user 
  const allowedUpdates = ['firstName', "lastName","profilePic","coverPic", "age","gender", "about", "skills"];


  const isAllowedUpdates = Object.keys(req.body).forEach((key)=>{
    if(!allowedUpdates.includes(key)){
      throw new Error({message:`${key} is not allowed to update`});
    } 
  })

   const updatedUser = await User.findByIdAndUpdate(userid,req.body,{new:true, runValidators: true});
   if(!updatedUser){
    throw new Error({message:"user not found"});
   }

   res.status(200).json({message: "user updated successfully", updatedUser});

 }catch(err){
  res.status(500).json({message:err.message,stack: err.stack})
 }
})




// user delete route
userRouter.delete("/delete/:userid", async(req, res) =>{

  try{
    //get the user from userid
    const {userid} = req.params;



    //delete the user
    const deletedUser = await User.findByIdAndDelete(userid);
    if(!deletedUser){
      throw new Error("user didn't found")
    }
    res.status(201).json({deletedUser})
  }catch(err){
    res.status(500).json({message: err.message, stack: err.stack})
  }
})





//user profile route
userRouter.get("/profile/:userid", async(req, res)=>{

  try{
    //get the userid from url
    const {userid} = req.params;

    //find the user using userid from database
    const user = await User.findById({_id: userid});
    if(!user){
      throw new Error({message:"user not found"});
    }

    //send user 
    
    res.status(200).json({user, message: "user found"})

  }catch(err){
    res.status(500).json({message:err.message , stack: err.stack})
  }
})


module.exports = userRouter;